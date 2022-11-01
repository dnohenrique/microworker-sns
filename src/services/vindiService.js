const axios = require('axios')
const config = require('../settings/config')
const serviceUrl = config.variables.serviceVindiUrl
const userNameVindi = config.variables.userNameVindi
const passwordVindi = config.variables.passwordVindi

exports.consultarDadosCliente = async (identificadorFiscal) => {
    let response = {}
    let url = `${serviceUrl}/customers`.concat(
        `?query=registry_code:${identificadorFiscal}`
    )
    await axios
        .get(url, {
            headers:{
                'Content-Type':'application/json;charset=utf-8',
                'Authorization': `Basic ${userNameVindi}`
            }
        })
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            throw new Error(error)
        })
    return response.data.customers
}

exports.cadastrarBill = async (payloadBillVindi) => {
    let response = {}
    let url = `${serviceUrl}/bills`
    await axios
        .post(url, payloadBillVindi, {
            headers:{
                'Content-Type':'application/json;charset=utf-8',
                'Authorization': `Basic ${userNameVindi}`
            }
        })
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            throw new Error(error)
        })
    return response.data.bill
}

exports.cancelarBill = async (billId) => {
    let response = {}
    let url = `${serviceUrl}/bills/${billId}`
    await axios
        .delete(url, {
            headers:{
                'Content-Type':'application/json;charset=utf-8',
                'Authorization': `Basic ${userNameVindi}`
            }
        })
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            throw new Error(error)
        })
    return response.data.bill
}

//#################### corrigir o metodo ####################
exports.atualizarDataVencimento = async (chargeId, payloadBillVindi) => {
    let response = {}
    let url = `${serviceUrl}/charges/${chargeId}`
    await axios
        .put(url, payloadBillVindi, {
            headers:{
                'Content-Type':'application/json;charset=utf-8',
                'Authorization': `Basic ${userNameVindi}`
            }
        })
        .then((retorno) => {
            response = retorno
        })
        .catch((error) => {
            response = error.response ? JSON.stringify(error.response) : error
            throw new Error(error)
        })
    return response.data.charge
}
