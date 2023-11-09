const fs = require('fs')
const s3Keys = require('./s3keys').default
const dataNfs = require('../../dist')
const getFile = require('./getFileS3').default
console.log(dataNfs)
// console.log(getFile)

// getFile(s3Keys[99]).then( file => {
//   console.log(file.path)
// }).catch(err => {
//   console.log(err)
// })
const runTest = async () => {
  s3Keys.forEach(async (item, index, array) => {
    try {
      const element = item
      console.log(
        `(${index}) ##################################################################`
      )
      console.log('Baixando ' + element)
      const file = await getFile(element)

      console.log(file)

      const xmlString = fs.readFileSync(file)
      // const b1 = new Date().getTime()
      // const dadoLegado = await dataNfs.getDataNFSLegado(xmlString)
      const b2 = new Date().getTime()
      const dadoV2 = await dataNfs.getDataNFSv2(xmlString)
      const b3 = new Date().getTime()

      // console.log('Retorno LEGADO : ')
      // console.log(dadoLegado[1])
      // console.log('TIME: ' + (b2 - b1) + 'ms \n\n')

      console.log('Retorno V2 : ')
      console.log(dadoV2)
      // console.log('TIME: ' + (b3 - b2) + 'ms')

      console.log(`${index + 1}/${array.length}`)

      if (dadoLegado[1].Numero !== dadoV2.numero) {
        console.log(
          '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  OOPS: ' +
            dadoV2.numero +
            '!==' +
            dadoLegado[1].Numero
        )
      }
      if (dadoV2.naturezaOperacao) {
        fs.unlink(file, (err) => {
          if (err) throw err
        })
      }
    } catch (err) {
      console.log(err)
    }
  })
}

runTest()
