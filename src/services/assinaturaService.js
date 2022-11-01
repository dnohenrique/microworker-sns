const axios = require('axios')
const config = require('../settings/config')

const serviceAssnaturaUrl = config.variables.serviceAssinaturaUrl

exports.inserirParcelaAssinatura = async (dataParam) => {
    let response = {}
    let url = `${serviceAssnaturaUrl}/Assinatura/parcela/faturaAvulsa`
    console.log('parcela assinatura inserir url ' + url)
    console.log(dataParam)
    await axios
        .post(url, dataParam)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            console.log('Erro incluir parcela assinatura: ' + error)
            throw new Error(response)
        })

    return response.result
}
