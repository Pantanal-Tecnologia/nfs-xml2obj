require('../../node_modules/dotenv').config()
const fs = require('fs')
const {
  S3Client,
  GetObjectCommand,
} = require('../../node_modules/@aws-sdk/client-s3')

const bucketName = String(process.env.AWS_BUCKET_NAME)
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
// const credentials_v2 = {
//   region,
//   accessKeyId,
//   secretAccessKey
// }
const credentials_v3 = {
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
}
// const s3 = new S3(credentials_v3)
const client = new S3Client(credentials_v3)

// downloads a file from s3
async function getFileStream(fileKey) {
  const downloadParams = {
    Bucket: bucketName,
    Key: fileKey,
  }
  const result = await new Promise(async (resolve, reject) => {
    // ###V2
    // s3.headObject(downloadParams, function (err, metadata) {
    //   if (err && err.code === 'NotFound') {
    //     resolve([false, `fileKey ${fileKey} NotFound`])
    //   }
    //   const file = fs.createWriteStream(`temp/${fileKey}.xml`);
    //   file.on('close', function(){
    //     console.log('close')
    //       resolve(file)
    //   });
    //   console.log(file.path)

    //   const res = s3.getObject(downloadParams).createReadStream().then(res => console.log(res)) //.pipe(file)

    // });

    // ###############V3
    const filePath = `temp/${fileKey}.xml`
    const command = new GetObjectCommand(downloadParams)
    const response = await client.send(command)
    response.Body.pipe(fs.createWriteStream(filePath))
      .on('error', (err) => reject(err))
      .on('close', () => resolve(filePath))
  })
  return result
}

module.exports.default = getFileStream
