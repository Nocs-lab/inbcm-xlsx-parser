import * as XLSX from "xlsx";
import { arquivistico, bibliografico, museologico } from "./schema.js";

/**
 * Verifies if Excel headers match the schema headers after normalization.
 * @param headers - Excel headers from the file.
 * @param headersSchema - Schema headers to validate against.
 * @returns Boolean indicating validity.
 */
function validateHeaders(headers: string[], headersSchema: string[]): boolean {
  return headers.length === headersSchema.length &&
    headers.every((header, idx) => header === headersSchema[idx]);
}

/**
 * Validates rows for required fields.
 * @param json - Preprocessed data from Excel.
 * @param requiredFields - Fields that must be present.
 * @param validateSituation - Whether to validate the "situacao" field.
 * @returns Validation results with data and errors.
 */
function validateRows(
  json: { [key: string]: string }[],
  requiredFields: string[],
  validateSituation: boolean
): { data: { [key: string]: string }[]; errors: string[], detailedErrors: Map<number, string[]>, naoEncontrados: Set<number> } {
  const missingFields = new Set<string>();
  const detailedErrors = new Map<number, string[]>();
  const naoEncontrados = new Set<number>();

  json.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field]) {
        missingFields.add(field);
        if (!detailedErrors.has(index)) detailedErrors.set(index, []);
        detailedErrors.get(index)?.push(field);
      } else if (validateSituation && field === "situacao" && row[field].toLocaleLowerCase() === "não localizado") {
        naoEncontrados.add(index);
      };
    });
  });

  return { data: json, errors: Array.from(missingFields), detailedErrors, naoEncontrados };
}

/**
 * Reads a file into an ArrayBuffer.
 * @param file - File to read.
 * @returns Promise resolving to ArrayBuffer.
 */
export async function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("XLSX_ERROR"));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parses and validates an Excel file against a schema.
 * @param buffer - Excel file buffer.
 * @param headersSchema - Expected column headers.
 * @param requiredFields - Mandatory fields.
 * @param validateSituation - Whether to validate the "situacao" field.
 * @returns Validation results.
 */
async function parseExcelFile(
  buffer: Buffer,
  headersSchema: string[],
  requiredFields: string[],
  validateSituation: boolean = false
): Promise<{ data: { [key: string]: string }[]; errors: string[], detailedErrors: Map<number, string[]>, naoEncontrados: Set<number> }> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const lines = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

  if (lines.length === 0) throw new Error("INVALID_HEADERS");

  // Normalize Excel headers and schema headers
  const excelHeaders = lines[0].map(header => String(header)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^(\d)/, "n$1")
    .replace(/(\d)$/, "$1")
  );

  if (!validateHeaders(excelHeaders, headersSchema)) throw new Error("INVALID_HEADERS");

  const rows = lines.slice(1).filter(row => row.length > 0);
  if (rows.length === 0) throw new Error("EMPTY_ROWS");

  // Map rows to JSON using normalized headers
  const json = rows.map(row => {
    if (row.length > excelHeaders.length) throw new Error("INVALID_ROW");
    const obj: { [key: string]: string } = {};
    excelHeaders.forEach((header, idx) => {
      obj[header] = String(row[idx] || "").normalize("NFD").trim().replace(/  +/g, "");
    });
    return obj;
  });

  return validateRows(json, requiredFields, validateSituation);
}

// Schema validation functions

export async function validate_museologico(buffer: Buffer) {
  return parseExcelFile(buffer, Object.keys(museologico.fields), museologico.required, true);
}

export async function validate_bibliografico(buffer: Buffer) {
  return parseExcelFile(buffer, Object.keys(bibliografico.fields), bibliografico.required, true);
}

export async function validate_arquivistico(buffer: Buffer) {
  return parseExcelFile(buffer, Object.keys(arquivistico.fields), arquivistico.required);
}
