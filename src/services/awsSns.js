const AWS = require('aws-sdk')
const config = require('../settings/config')
const awsRegion = config.variables.awsRegion
AWS.config.update({ region: awsRegion })


module.exports.publicarSNS = async (topicArn, message) => {
    const params = {
        Message: message,
        TopicArn: topicArn,
    }
    let result = ''
    const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' })
        .publish(params)
        .promise()

    await publishTextPromise
        .then((data) => {
            console.log(
                `Mensagem  ${params.Message} enviada com sucesso para o topico ${params.TopicArn}`
            )
            console.log('MessageID is ' + data.MessageId)
            result = data.MessageId
        })
        .catch((err) => {
            console.log(err)
        })

    return result
}
