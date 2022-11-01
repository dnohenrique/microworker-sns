const AWS = require('aws-sdk')
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    AWS.config.update({
        region: 'us-east-1',
        credentials: {
            accessKeyId: 'accessKeyId',
            secretAccessKey: 'secretAccessKey',
        },
        sns: {
            endpoint: 'http://localstack:4566',
        },
        sqs: {
            endpoint: 'http://localstack:4566',
        },
        s3: {
            endpoint: 'http://localstack:4566',
            s3ForcePathStyle: true,
        },
    })
}
module.exports = AWS
