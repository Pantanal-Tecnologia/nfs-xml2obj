declare module 'data-nfs' {
  interface LegacyResponse {
    cnpjEmit: string | boolean
    cnpjDest: string | boolean
    valorNF: string | boolean
    Numero: string | boolean
  }

  interface V2Response {
    cnpjEmit: string | null
    cnpjDest: string | null
    valorNF: string | null
    numero: string | null
    valorBruto: string | null
    valorLiquido: string | null
    valorDeducoes: string
    retencoes: string
    naturezaOperacao: string | null
    impostos: {
      iss: string | null
      valorIss: string | null
      valorCofins: string | null
      valorPis: string | null
      valorIr: string | null
      valorCsll: string | null
    }
  }

  const getDataNFSLegado: (xml: string) => Promise<LegacyResponse>

  const getDataNFSv2: (xml: string) => Promise<V2Response>
}
