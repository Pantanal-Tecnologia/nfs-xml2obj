// const getDataNFSLegado = require('./legado').default
const getDataNFSv2 = require('./v2').default

module.exports = {getDataNFSv2 }

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
    cpfEmit?: string
    valorNF?: string
    numero?: string
    iss?: string
    valorIss: string
    valorBruto?: string
    valorLiquido?: string
    valorDeducoes: string
    retencoes: string
    naturezaOperacao?: string
  }
  export const getDataNFSv2: (xml: string) => Promise<V2Response>
}
