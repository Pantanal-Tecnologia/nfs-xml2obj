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

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err)
      return
    }
    filenames.forEach(function (filename) {
      fs.readFile(dirname + filename, 'utf-8', function (err, content) {
        if (err) {
          onError(err)
          return
        }
        onFileContent(filename, content)
      })
    })
  })
}

const runTest = async (filename, content) => {
  // s3Keys.forEach(async (item, index, array) => {
  try {
    // const element = item
    console.log(
      `(${filename}) ##################################################################`
    )
    console.log('Baixando')
    // const file = await getFile(element)

    // console.log(file)

    // const xmlString = fs.readFileSync(filename)
    const b2 = new Date().getTime()
    const dadoV2 = await dataNfs.getDataNFSv2(content)
    const b3 = new Date().getTime()

    console.log('Retorno V2 : ')
    console.log(dadoV2)
    console.log('TIME: ' + (b3 - b2) + 'ms')

    // console.log(`${index + 1}/${array.length}`)

    // if (dadoV2.naturezaOperacao) {
    //   fs.unlink(file, (err) => {
    //     if (err) throw err
    //   })
    // }
  } catch (err) {
    console.log(err)
  }
  // })
}

readFiles('./temp/', runTest, console.log)
