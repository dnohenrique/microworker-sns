const axios = require('axios')
const config = require('../settings/config')

const serviceNotaDebitoUrl = config.variables.serviceNotaDebitoUrl

exports.atualizarDivergente = async (contaReceberId) => {
    let response = {}
    const url = `${serviceNotaDebitoUrl}/notaDebito/divergente/contaReceber/${contaReceberId}`
    console.warn('atualizar divergente url: ' + url)
    await axios
        .put(url, {})
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            response = error.response ? JSON.stringify(error.response) : error
            throw new Error(error)
        })

    return response.data.data.success
}
