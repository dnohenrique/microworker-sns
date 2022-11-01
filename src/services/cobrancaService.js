const axios = require('axios')
const config = require('../settings/config')

const serviceCobrancaUrl = config.variables.serviceCobrancaUrl

exports.consultarPorFatura = async (billId) => {
    let response = {}
    let url = `${serviceCobrancaUrl}/api/Cobranca/bill?billId=${billId}`
    console.log('consulta cobranca url: ' + url)
    await axios
        .get(url)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            response = error.response ? JSON.stringify(error.response) : error
            throw new Error(error)
        })

    return response.data.result
}
