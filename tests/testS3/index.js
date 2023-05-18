const fs = require('fs')
const s3Keys = require("./s3keys").default;
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
  for (let index = 0; index < 1000; index++) {
    const element = s3Keys[index];
    console.log('##################################################################')  
    console.log('Baixando ' + element)  
    await getFile(element).then( async file => {
      const xmlString = fs.readFileSync(file);
      const b1 = new Date().getTime()
      const dadoLegado = await dataNfs.getDataNFSLegado(xmlString)
      const b2 = new Date().getTime()
      const dadoV2= await dataNfs.getDataNFSv2(xmlString)
      const b3 = new Date().getTime()

      console.log('Retorno LEGADO : ')  
      console.log(dadoLegado[1])  
      console.log('TIME: ' + (b2-b1)  + 'ms \n\n')  

      console.log('Retorno V2 : ')  
      console.log(dadoV2[1])  
      console.log('TIME: ' + (b3-b2) + 'ms')

      if (dadoLegado[1].valorNF !== dadoV2[1].valorNF) {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  OOPS: ' + dadoV2[1].valorNF + "!==" + dadoLegado[1].valorNF)
      }
      if (dadoLegado[0] && dadoV2[0]) {
        fs.unlink(file)
      }
    }).catch(err => {
      console.log(err)
    })
  }
}



runTest()