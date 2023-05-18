import fs from 'fs'
const xml2js = require('xml2js');

const getDataNFSLegado = async (xmlString: String) => {

  const stripPrefix = xml2js.processors.stripPrefix;
  const result: any =  await new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({
      attrkey: "ATTR",
      tagNameProcessors: [ stripPrefix ],
      attrNameProcessors: [ stripPrefix ]
    });

    parser.parseString(xmlString, (error: any, result: any) => {
      if (error) resolve(false)
      else resolve(result)
    })
  })


  let nf
  let layout
  //  LAYOUT ABRASF contem ConsultarNfseResposta
  //  LAYOUT DIVERGENTE 1 contem ConsultarNfseRpsResposta
  if (result?.EnviarLoteRpsEnvio) {
    return [false, 'Não é possivel validar o fiscal com o XML do RPS, é nescessario o XML da nota fiscal.']
  }
  try {
    if (result?.GerarNfseResposta?.ListaNfse) {
      nf = result?.GerarNfseResposta?.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0] || false
    } else if (result?.ComplNfse) {
      nf = result?.ComplNfse.Nfse[0].InfNfse[0] || false
    } else if (result?.EnviarLoteRpsSincronoResposta?.ListaNfse) {
      // console.log(result.ConsultarNfseLote.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0])
      nf = result?.EnviarLoteRpsSincronoResposta?.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0] || false
    } else if (result?.Nfse) {
      // console.log(result?.Nfse.Numero)
      nf = result?.Nfse || false
    } else if (result?.LoteNotaFiscal?.CompNfse) {
      // console.log(result.ConsultarNfseLote.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0])
      nf = result?.LoteNotaFiscal?.CompNfse[0].Nfse[0].InfNfse[0] || false
    } else if (result?.ConsultarNfseLote?.ListaNfse) {
      // console.log(result.ConsultarNfseLote.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0])
      nf = result.ConsultarNfseLote.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0] || false
    } else if (typeof result.CompNfse !== 'undefined') {
      if (typeof result.CompNfse.Nfse !== 'undefined') {
        nf = result.CompNfse.Nfse[0].InfNfse[0] || false
      }else if (result.CompNfse[0] !== 'undefined') {
        nf = result.CompNfse[0].Nfse[0].InfNfse[0] || false
      }else {
        nf = false
      }
    } else if (typeof result?.ConsultarNfseResposta?.ListaNfse !== 'undefined') {
      nf = result.ConsultarNfseResposta.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0] || false
    } else if (typeof result?.ConsultarNfseFaixaResposta?.ListaNfse !== 'undefined') {
      nf = result.ConsultarNfseFaixaResposta.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0] || false
    } else if (typeof result?.ConsultarNfseRpsResposta?.CompNfse[0]?.Nfse !== 'undefined') {
      nf = result?.ConsultarNfseRpsResposta.CompNfse[0].Nfse[0].InfNfse[0] || false
    } else if (typeof result?.NFSE?.NOTA !== 'undefined') {
      nf = result.NFSE.NOTA[0] || false
    } else if (typeof result?.nota !== 'undefined') {
      // console.log('###RESULT#nota', result)
      nf = result.nota || false
    } else if (typeof result?.ConsultarNfseServicoPrestadoResposta?.ListaNfse) {
      // console.log('ConsultarNfseServicoPrestadoResposta', result?.ConsultarNfseServicoPrestadoResposta)
      nf = result?.ConsultarNfseServicoPrestadoResposta?.ListaNfse[0].CompNfse[0].Nfse[0].InfNfse[0] || false
    } else {
      return [false, 'LAYOUT DE XML DESCONHECIDO, ENTRE EM CONTATO COM O SUPORTE.']
    }
  } catch (error) {
    nf = false
  }
  
  if (!nf) {  
    return [false, `LAYOUT DE XML DESCONHECIDO, ENTRE EM CONTATO COM O SUPORTE.`]
  }

  let dados : any = false
  let cnpjEmit: any = false
  let cnpjDest: any = false
  let valorNF: any = false
  let Numero: any = false

  //  ######### ------------  cnpjEmit
  try {
    cnpjEmit = nf.PrestadorServico[0].IdentificacaoPrestador[0].CpfCnpj[0].Cnpj[0] 
  } catch (error) {}
  if (!cnpjEmit) {
    try {
      cnpjEmit = nf.PrestadorServico[0].IdentificacaoPrestador[0].Cnpj[0] 
    } catch (error) {}
  }

  if (!cnpjEmit) {
    try {
      cnpjEmit = nf.DeclaracaoPrestacaoServico[0].Prestador[0].IdentificacaoPrestador[0].CpfCnpj[0].Cnpj[0]
    } catch (error) {} 
  }

  if (!cnpjEmit) {
    try {
      cnpjEmit = nf.DeclaracaoPrestacaoServico[0].IdentificacaoPrestador[0].CpfCnpj[0].Cnpj[0]
    } catch (error) {} 
  }

  if (!cnpjEmit) {
    try {
      cnpjEmit = nf.DeclaracaoPrestacaoServico[0].InfDeclaracaoPrestacaoServico[0].Prestador[0].CpfCnpj[0].Cnpj[0]
    } catch (error) {} 
  }

  if (!cnpjEmit) {
    try {
      cnpjEmit = nf.PRESTCPFCNPJ[0]
    } catch (error) {} 
  }

  if (!cnpjEmit) {
    try {
      cnpjEmit = nf.prestador[0].cpfcnpj[0]
    } catch (error) {} 
  }

  //  ######### ------------  cnpjDest
  try {
    cnpjDest =   nf.TomadorServico[0].IdentificacaoTomador[0].CpfCnpj[0].Cnpj[0]  
  } catch (error) {}
  
  if (!cnpjDest) {
    try {
      cnpjDest =   nf.TomadorServico[0].IdentificacaoTomador[0].Cnpj[0]  
    } catch (error) {} 
  }
  if (!cnpjDest) {
    try {
      cnpjDest = nf.DeclaracaoPrestacaoServico[0].Tomador[0].IdentificacaoTomador[0].CpfCnpj[0].Cnpj[0]
    } catch (error) {} 
  }
  if (!cnpjDest) {
    try {
      cnpjDest = nf.DeclaracaoPrestacaoServico[0].InfDeclaracaoPrestacaoServico[0].Tomador[0].IdentificacaoTomador[0].CpfCnpj[0].Cnpj[0]
    } catch (error) {} 
  }
  if (!cnpjDest) {
    try {
      cnpjDest = nf.DeclaracaoPrestacaoServico[0].InfDeclaracaoPrestacaoServico[0].Tomador[0].IdentificacaoTomador[0].CpfCnpj[0].Cpf[0]
    } catch (error) {} 
  }
  if (!cnpjDest) {
    try {
      cnpjDest = nf.DeclaracaoPrestacaoServico[0].InfDeclaracaoPrestacaoServico[0].TomadorServico[0].IdentificacaoTomador[0].CpfCnpj[0].Cnpj[0]
    } catch (error) {} 
  }
  if (!cnpjDest) {
    try {
      cnpjDest = nf.DeclaracaoPrestacaoServico[0].DadosTomador[0].IdentificacaoTomador[0].CpfCnpj[0].Cnpj[0]
    } catch (error) {} 
  }

  if (!cnpjDest) {
    try {
      cnpjDest = nf.TOMCPFCNPJ[0]
    } catch (error) {} 
  }
  if (!cnpjDest) {
    try {
      cnpjDest = nf.tomador[0].cpfcnpj[0]
    } catch (error) {} 
  }

  //  ######### ------------  valorNF
  try {
    valorNF = nf.Servico[0].Valores[0].ValorServicos[0]    
  } catch (error) {}
  if (!valorNF) {  
    try {
      valorNF = nf.ValoresNfse[0].BaseCalculo[0]    
    } catch (error) {}
  }
  if (!valorNF) {  
    try {
      valorNF = nf.DeclaracaoPrestacaoServico[0].ValorServicos[0]
    } catch (error) {}
  }
  if (!valorNF) {  
    try {
      valorNF = nf.DeclaracaoPrestacaoServico[0].InfDeclaracaoPrestacaoServico[0].Servico[0].Valores[0].ValorServicos[0]
    } catch (error) {}
  }

  if (!valorNF) {  
    try {
      valorNF = nf.DeclaracaoPrestacaoServico[0].InfDeclaracaoPrestacaoServico[0].Servico[0].Valores[0].ValorServicos[0]
    } catch (error) {}
  }

  if (!valorNF) {  
    try {
      valorNF = nf.VALORTOTALSERVICOS[0]
    } catch (error) {}
  }

  if (!valorNF) {  
    try {
      valorNF = nf.basecalculo[0]
    } catch (error) {}
  }

  //  ######### ------------  chave
  try {
    Numero = nf.Numero[0]
  } catch (error) {}
  if (!Numero) {
    try {
      Numero = nf.COD[0]
    } catch (error) {}    
  }

  if (!Numero) {
    try {
      Numero = nf.numero[0]
    } catch (error) {}    
  }
  
  if (cnpjEmit !== false) {
    cnpjEmit = String(cnpjEmit).replace(/[^0-9]/g, '')
  }
  if (cnpjDest !== false) {
    cnpjDest = String(cnpjDest).replace(/[^0-9]/g, '')
  }
  // console.log({
  //   cnpjEmit,
  //   cnpjDest,
  //   valorNF,
  //   Numero
  // })
  
  if (cnpjEmit
    && cnpjDest
    && valorNF
    && Numero) {
      dados = {
        cnpjEmit,
        cnpjDest,
        valorNF,
        Numero
      }
  } else {
    return [false, `ERRO AO LER DADOS DO DESTE LAYOUT, ENTRE EM CONTATO COM O SUPORTE.
      ${String(Boolean(cnpjEmit))} | 
      ${String(Boolean(cnpjDest))} | 
      ${String(Boolean(valorNF))} | 
      ${String(Boolean(Numero))} | 
    `]
  }
  
  return [ true, dados ]

}

export default getDataNFSLegado