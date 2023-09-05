declare module 'data-nfs' {
  interface LegacyResponse {
    cnpjEmit: string | boolean
    cnpjDest: string | boolean
    valorNF: string | boolean
    Numero: string | boolean
  }

  interface V2Response {
    cnpjEmit?: string
    cnpjDest?: string
    valorNF?: string
    numero?: string
    valorBruto?: string
    valorLiquido?: string
    valorDeducoes: string
    retencoes: string
    naturezaOperacao?: string
    impostos: {
      iss?: string
      valorIss?: string
      valorCofins?: string
      valorPis?: string
      valorIr?: string
      valorCsll?: string
    }
  }

  const getDataNFSLegado: (xml: string) => Promise<LegacyResponse>

  const getDataNFSv2: (xml: string) => Promise<V2Response>
}
