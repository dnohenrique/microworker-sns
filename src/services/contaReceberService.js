const axios = require('axios')
const config = require('../settings/config')

const serviceContaReceberURL = config.variables.serviceContaReceberUrl

exports.consultarRecebimentosParaEmissaoFatura = async (contaReceberId) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber/${contaReceberId}/recebimentosParaEmissaoFatura`
    await axios
        .get(url)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            response = error.response ? JSON.stringify(error.response) : error
            throw new Error(error)
        })

    return response.data.data.item
}

//TODO: Adicionar endpoint no ms contas a receber
exports.consultarRecebimentosParaCancelarFaturaVindi = async (
    contaReceberId
) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber/${contaReceberId}/recebimentosParaCancelamentoFatura`

    await axios
        .get(url)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            response = error.response ? JSON.stringify(error.response) : error
            throw new Error(error)
        })

    return response.data.data.item
}

exports.atualizarRecebimentoPosEmissaoFatura = async (
    contaReceberId,
    recebimentoId,
    recebimento
) => {
    let response = {}

    let url = `${serviceContaReceberURL}`.concat(
        `/contaReceber/${contaReceberId}`.concat(
            `/recebimento/${recebimentoId}`.concat(`/posEmissaoFatura`)
        )
    )
    await axios
        .patch(url, recebimento)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            response = error.response ? JSON.stringify(error.response) : error
            throw new Error(response)
        })

    return response.data.data
}

exports.atualizarRecebimentoPosCancelamentoFatura = async (
    contaReceberId,
    recebimentoId
) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber/${contaReceberId}/recebimento/${recebimentoId}/situacao`

    await axios
        .patch(url, { situacao: 'CANCELADO' })
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            response = error.response
                ? JSON.stringify(error.response.data)
                : error
            throw new Error(response)
        })

    return response.data.data
}

exports.consultarRecebimentosPendenteAtualizacaoVencimento = async (
    contaReceberId
) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber/${contaReceberId}/recebimentosPendenteAtualizacaoVencimento`
    await axios
        .get(url)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            response = error.response ? JSON.stringify(error.response) : error
            throw new Error(error)
        })

    return response.data.data.item
}

exports.atualizarSituacaoRecebimentoPosAtualizacaoDataVencimento = async (
    contaReceberId,
    recebimentoId
) => {
    let response = {}
    let url = `${serviceContaReceberURL}`.concat(
        `/contaReceber/${contaReceberId}`.concat(
            `/recebimento/${recebimentoId}`.concat(`/situacao`)
        )
    )
    await axios
        .patch(url, { situacao: 'EMITIDO' })
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            response = error.response ? JSON.stringify(error.response) : error
            throw new Error(response)
        })

    return response.data.data
}

exports.atualizarIdBenner = async (contaReceberId, recebimentoId, idBenner) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber/${contaReceberId}/recebimento/${recebimentoId}/idBenner/${idBenner}`
    console.log('atualizarIdBenner url ' + url)
    await axios
        .patch(url, {})
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            console.log(error)
            throw new Error(response)
        })

    return response.data.data
}

exports.inserir = async (dataParam) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber`
    console.log('conta a receber inserir url ' + url)
    await axios
        .post(url, dataParam)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            console.log(error)
            throw new Error(response)
        })

    return response.data.data
}

exports.inserirBoleto = async (dataParam) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber`
    console.log('conta a receber inserir boleto' + url)
    console.log(dataParam)
    await axios
        .post(url, dataParam)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            console.log(error)
            throw new Error(response)
        })

    return response.data.data
}

exports.inserirCartaoExtra = async (dataParam) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber/extraReserva`
    console.log('conta a receber inserir extra url ' + url)
    console.log(dataParam)
    await axios
        .post(url, dataParam)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            console.log(error)
            throw new Error(response)
        })

    return response.data.data
}

exports.inserirCartaoRecorrencia = async (dataParam) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber/recorrencia`
    console.log('conta a receber inserir recorrencia url ' + url)
    console.log(dataParam)
    await axios
        .post(url, dataParam)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            console.log(error)
            throw new Error(response)
        })

    return response.data.data
}

exports.inserirCartaoRecorrenciaRecebimento = async (
    contaReceberId,
    dataParam
) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber/${contaReceberId}/recebimento/cartaoRecorrencia`
    console.log('conta a receber inserir recorrencia recebimento url ' + url)
    console.log(dataParam)
    await axios
        .post(url, dataParam)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            console.log(error)
            throw new Error(response)
        })

    return response.data
}

exports.consultarContaReceber = async (documentoFiscal) => {
    let response = {}
    let url = `${serviceContaReceberURL}/contaReceber?DocumentoFiscal=${documentoFiscal}&Limit=1`
    console.log('conta a receber consultar url ' + url)
    await axios
        .get(url)
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            console.log(error)
            throw new Error(error)
        })

    return response.data.data
}

exports.consultaRecebimentoPeloChargeId = async (chargeId) => {
    let response
    let url = `${serviceContaReceberURL}/contaReceber/recebimento/${chargeId}/chargeId`
    console.log('Recebimento chargeId consultar url ' + url)
    await axios
        .get(url)
        .then((retorno) => {
            response = retorno.data.data
        })
        .catch((error) => {
            console.log(error)
            response = null
        })

    return response
}
