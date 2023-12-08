const aws = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const endpoint = new aws.Endpoint(process.env.ENDPOINT_BACKBLAZE);

const S3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
});

const upload = async (path, buffer, mimeType) => {
    const imagem = await S3.upload({
        Bucket: process.env.BUCKET_NAME,
        Key: path,
        Body: buffer,
        ContentType: mimeType
    }).promise()
    return {
        url: imagem.Location,
        path: imagem.Key
    }
};

const exclusao = async (path) => {
    await S3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: path
    }).promise()
}

module.exports = { upload, exclusao };