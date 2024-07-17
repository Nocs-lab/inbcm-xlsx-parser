import * as XLSX from "xlsx"
import { arquivistico, bibliografico, museologico } from "./schema.js"

/**
 * Transforma um texto em uma string slug
 * @param text - Texto a ser transformado
 * @returns String slug
 */
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^(\d)/, "n$1")
    .replace(/(\d)$/, "$1")
}

/**
 * Verifica se as colunas do arquivo excel são válidas
 * @param headers - Lista de colunas do arquivo excel
 * @param headersSchema - Lista de colunas do schema
 * @returns Booleano indicando se os colunas são válidos
 */
function validateHeaders(headers: string[], headersSchema: string[]): boolean {
  return (
    headers.length === headersSchema.length &&
    headers.every((header, idx) => header === headersSchema[idx])
  )
}

/**
 * vvAlida as linhas do arquivo excel, verificando se os campos obrigatórios estão preenchidos
 * @param rows - Lista de linhas do arquivo excel
 * @param headers - Lista de colunas do arquivo excel
 * @param requiredFields - Lista de campos obrigatórios
 * @param json - Lista de objetos gerados a partir das linhas
 * @returns Objeto com a lista de objetos e a lista de erros
 */
function validateRows(
  rows: string[][],
  headers: string[],
  requiredFields: string[],
  json: { [key: string]: string }[]
): {
  data: { [key: string]: string }[]
  errors: string[]
} {
  const data: { [key: string]: string }[] = []
  const errors: string[] = []

  rows.forEach((row) => {
    const rowData: { [key: string]: string } = {}
    headers.forEach((header, idx) => {
      rowData[header] = row[idx] || ""
    })
    data.push(rowData)

    requiredFields.forEach((field) => {
      if (!rowData[field]) {
        errors.push(field)
      }
    })
  })

  return {
    data: json,
    errors: Array.from(new Set(errors))
  }
}

/**
 * Lê um arquivo e retorna seu conteúdo como ArrayBuffer
 * @param file - Arquivo a ser lido
 * @returns Conteúdo do arquivo como ArrayBuffer
 */
export async function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error("XLSX_ERROR"))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Valida um arquivo excel de acordo com o schema passado
 * @param file - Arquivo excel a ser validado
 * @param headersSchema - Lista de colunas do arquivo excel
 * @param requiredFields - Lista de campos obrigatórios
 * @returns Objeto com a lista de objetos e a lista de erros
 */
async function parseExcelFile(
  buffer: Buffer,
  headersSchema: string[],
  requiredFields: string[]
): Promise<{ data: { [key: string]: string }[]; errors: string[] }> {
  const workbook = XLSX.read(buffer, { type: "buffer" })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const lines = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

  if (!lines.length) throw new Error("INVALID_HEADERS")

  const headers = (lines[0] as string[]).map((header) => slugify(header))
  if (!validateHeaders(headers, headersSchema)) {
    throw new Error("INVALID_HEADERS")
  }

  const rows = lines.slice(1).filter((row) => !!row.length)
  if (!rows.length) throw new Error("EMPTY_ROWS")

  const json = rows.map((row) => {
    if (row.length > headers.length) throw new Error("INVALID_ROW")

    const obj: { [key: string]: string } = {}
    headers.forEach((header, idx) => {
      obj[header] = row[idx] || ""
    })
    return obj
  })

  return validateRows(rows, headers, requiredFields, json)
}

/**
 * Valida um arquivo excel do acervo museológico
 * @param file - Arquivo excel a ser validado
 * @returns Objeto com a lista de objetos e a lista de erros
 */
export async function validate_museologico(
  buffer: Buffer
): Promise<{ data: { [key: string]: string }[]; errors: string[] }> {
  return parseExcelFile(buffer, Object.keys(museologico.fields), museologico.required)
}

/**
 * Valida um arquivo excel do acervo bibliográfico
 * @param file - Arquivo excel a ser validado
 * @returns Objeto com a lista de objetos e a lista de erros
 */
export async function validate_bibliografico(
  buffer: Buffer
): Promise<{ data: { [key: string]: string }[]; errors: string[] }> {
  return parseExcelFile(buffer, Object.keys(bibliografico.fields), bibliografico.required)
}

/**
 * Valida um arquivo excel do acervo arquivístico
 * @param file - Arquivo excel a ser validado
 * @returns Objeto com a lista de objetos e a lista de erros
 */
export async function validate_arquivistico(
  buffer: Buffer
): Promise<{ data: { [key: string]: string }[]; errors: string[] }> {
  return parseExcelFile(buffer, Object.keys(arquivistico.fields), arquivistico.required)
}

