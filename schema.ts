export const museologico = {
  fields: {
    nderegistro: "Número de Registro",
    outrosnumeros: "Outros Números",
    situacao: "Situação",
    denominacao: "Denominação",
    titulo: "Título",
    autor: "Autor",
    classificacao: "Classificação",
    resumodescritivo: "Resumo Descritivo",
    dimensoes: "Dimensões",
    materialtecnica: "Material/Técnica",
    estadodeconservacao: "Estado de Conservação",
    localdeproducao: "Local de Produção",
    datadeproducao: "Data de Produção",
    condicoesdereproducao: "Condições de Reprodução",
    midiasrelacionadas: "Mídias Relacionadas"
  },
  required: [
    "nderegistro",
    "situacao",
    "denominacao",
    "autor",
    "resumodescritivo",
    "dimensoes",
    "materialtecnica",
    "estadodeconservacao",
    "condicoesdereproducao"
  ]
}

export const bibliografico = {
  fields: {
    nderegistro: "Número de Registro",
    outrosnumeros: "Outros Números",
    situacao: "Situação",
    titulo: "Título",
    tipo: "Tipo",
    identificacaoderesponsabilidade: "Identificação de Responsabilidade",
    localdeproducao: "Local de Produção",
    editora: "Editora",
    datadeproducao: "Data de Produção",
    dimensaofisica: "Dimensão Física",
    materialtecnica: "Material/Técnica",
    encadernacao: "Encadernação",
    resumodescritivo: "Resumo Descritivo",
    estadodeconservacao: "Estado de Conservação",
    assuntoprincipal: "Assunto Principal",
    assuntocronologico: "Assunto Cronológico",
    assuntogeografico: "Assunto Geográfico",
    condicoesdereproducao: "Condições de Reprodução",
    midiasrelacionadas: "Mídias Relacionadas"
  },
  required: [
    "nderegistro",
    "situacao",
    "titulo",
    "tipo",
    "identificacaoderesponsabilidade",
    "localdeproducao",
    "editora",
    "datadeproducao",
    "dimensaofisica",
    "materialtecnica",
    "encadernacao",
    "resumodescritivo",
    "estadodeconservacao",
    "assuntoprincipal",
    "condicoesdereproducao"
  ]
}

export const arquivistico = {
  fields: {
    coddereferencia: "Código de Referência",
    titulo: "Título",
    data: "Data",
    niveldedescricao: "Nível de Descrição",
    dimensaoesuporte: "Dimensão e Suporte",
    nomedoprodutor: "Nome do Produtor",
    historiaadministrativabiografia: "História Administrativa/Biografia",
    historiaarquivistica: "História Arquivística",
    procedencia: "Procedência",
    ambitoeconteudo: "Âmbito e Conteúdo",
    sistemadearranjo: "Sistema de Arranjo",
    condicoesdereproducao: "Condições de Reprodução",
    existenciaelocalizacaodosoriginais:
      "Existência e Localização dos Originais",
    notassobreconservacao: "Notas sobre Conservação",
    pontosdeacessoeindexacaodeassuntos:
      "Pontos de Acesso e Indexação de Assuntos",
    midiasrelacionadas: "Mídias Relacionadas"
  },
  required: [
    "coddereferencia",
    "titulo",
    "data",
    "niveldedescricao",
    "dimensaoesuporte",
    "nomedoprodutor"
  ]
}
