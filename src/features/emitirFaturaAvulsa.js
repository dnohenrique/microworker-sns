const cobrancaService = require('../services/cobrancaService')
const contaReceberService = require('../services/contaReceberService')
const assinaturaService = require('../services/assinaturaService')
const awsSns = require('../services/awsSns')
const config = require('../settings/config')

exports.emitir = async (billId) => {
    console.log('Inicio Cadastro fatura avulsa contas a receber.')
    console.log('Bill id:')
    console.log(billId)

    console.log('Consulta Cobrança(Bill)...')

    let cobranca = await cobrancaService.consultarPorFatura(billId)

    let chargeId = cobranca.charges[0].chargeId
    let resultado = null
    let recebimentoExists = await contaReceberService.consultaRecebimentoPeloChargeId(
        chargeId
    )
    if (recebimentoExists !== null && recebimentoExists.itens.length > 0) {
        console.log(`Recebimento já existe ChargeId: ${chargeId}.`)
    } else {
        let tipoRecebimento = cobranca.charges[0].paymentMethod.name.toUpperCase()

        if (
            tipoRecebimento === 'BOLETO BANCÁRIO' ||
            tipoRecebimento == 'DINHEIRO'
        ) {
            resultado = await Boleto(cobranca, tipoRecebimento)
        } else if (tipoRecebimento === 'CARTÃO DE CRÉDITO RECORRÊNCIA') {
            resultado = await CartaoRecorrencia(cobranca)
        } else {
            console.log(
                `************************Forma de pagamento ${cobranca.charges[0].paymentMethod.name} não mapeada.`
            )
        }

        if (resultado) {
            const message = `${resultado.contaReceberId}:${resultado.idRecebimento}`
            console.log('Publica SNS integracao benner:')
            console.log(message)

            await awsSns.publicarSNS(config.variables.awsSnsTopicArn, message)
        }
    }
}

async function Boleto(cobranca, tipoRecebimento) {
    console.log('Boleto')
    var recebimentosArray = []

    recebimentosArray.push({
        chargeId: cobranca.charges[0].chargeId,
        billId: cobranca.billId,
        //dataRecebimento,
        dataVencimento: cobranca.charges[0].due_At,
        dataEmissao: cobranca.dataCriacao,
        juros: 0,
        multa: 0,
        divergencia: 0,
        desconto: 0,
        valorNominal: parseFloat(cobranca.charges[0].amount),
        //valorRecebido: 0,
        formaRecebimento: tipoRecebimento == 'DINHEIRO' ? 'DINHEIRO' : 'BOLETO',
    })

    let dataParam = {
        titular: cobranca.customer.name,
        identificadorFiscal: cobranca.customer.code,
        valorNominal: parseFloat(cobranca.charges[0].amount),
        recebimentos: recebimentosArray,
    }

    console.log('Conta a receber inserir Boleto rest...')
    await contaReceberService.inserirBoleto(dataParam)

    //Buscar os IDs Conta a receber e Recebimento para inserção da parcela
    let chargeId = cobranca.charges[0].chargeId
    let recebimentoExists = await contaReceberService.consultaRecebimentoPeloChargeId(
        chargeId
    )

    if (recebimentoExists !== null && recebimentoExists.itens.length > 0) {
        console.log('Parcela Assinatura inserir rest...')
        //Parcela Assinatura
        let dataParamParcelaAssinatura = {
            idContaReceber: recebimentoExists.itens[0].id.toString(),
            idRecebimento:
                recebimentoExists.itens[0].recebimentos[0].recebimentoId,
            cpf: cobranca.customer.code,
            referencia: cobranca.charges[0].due_At,
            tipoRecebimento:
                tipoRecebimento == 'DINHEIRO' ? 'Dinheiro' : 'Boleto',
            valorNominal: parseFloat(cobranca.charges[0].amount),
        }
        console.log('Parcela Assinatura inserir rest...')
        await assinaturaService.inserirParcelaAssinatura(
            dataParamParcelaAssinatura
        )

        return {
            contaReceberId: dataParamParcelaAssinatura.idContaReceber,
            idRecebimento: dataParamParcelaAssinatura.idRecebimento,
        }
    } else {
        console.log(
            'Não foi possível encontrar o(s) ID(s) Contaa Receber/Recebimento'
        )
    }

    return null
}

async function CartaoRecorrencia(cobranca) {
    console.log('Cartao Recorrência')

    //Buscar conta a receber se não tiver cria uma nova
    console.log('Busca conta a receber existente')
    let idContaReceberRecorrencia = ''
    let existeContaReceber = await contaReceberService.consultarContaReceber(
        cobranca.customer.code
    )

    //Validação conta a receber existe?
    if (
        existeContaReceber.itens !== undefined &&
        existeContaReceber.itens !== null &&
        existeContaReceber.itens[0] !== undefined &&
        existeContaReceber.itens[0].id !== ''
    ) {
        console.log('Id Conta a receber encontrado')
        idContaReceberRecorrencia = existeContaReceber.itens[0].id
    } else {
        //Cria uma nova conta a receber
        let dataParamContaReceber = {
            titular: cobranca.customer.name,
            identificadorFiscal: cobranca.customer.code,
            valorNominal: parseFloat(cobranca.charges[0].amount),
        }

        console.log('Conta a receber inserir (novo) rest...')
        let contaReceberRecorrencia = await contaReceberService.inserirCartaoRecorrencia(
            dataParamContaReceber
        )
        if (contaReceberRecorrencia.id !== '') {
            console.log('Cadastro conta corrente e get id')
            idContaReceberRecorrencia = contaReceberRecorrencia.id
        }
    }

    let dataParam = {
        valorNominal: parseFloat(cobranca.charges[0].amount),
        chargeId: cobranca.charges[0].chargeId,
        lastTransactionStatus: cobranca.charges[0].status,
        dataVencimento: cobranca.charges[0].due_At,
        dataEmissao: cobranca.dataCriacao,
        billId: cobranca.billId,
        billItemId: 0, //TODO Verificar
        numeroParcelas: cobranca.charges[0].installments,
        transacao: {
            idTransacao: cobranca.charges[0].lastTransaction.transactionId,
            ocorrencia: cobranca.dataCriacao,
            adquirente:
                cobranca.charges[0].lastTransaction.gateway !== null
                    ? cobranca.charges[0].lastTransaction.gateway.connector
                    : '',
            bandeira:
                cobranca.charges[0].lastTransaction.payment_profile !== null &&
                cobranca.charges[0].lastTransaction.payment_profile
                    .payment_Company !== null
                    ? cobranca.charges[0].lastTransaction.payment_profile
                          .payment_Company.name
                    : '',
            //Criar Authorization?!
            // nsu:
            //     cobranca.charges[0].lastTransaction.gateway_response_fields.nsu,
            nsu: cobranca.charges[0].lastTransaction.gateway_Authorization,
            pedido: '',
            metodoPagamento: 'CartaoRecorrencia',
            cartaoUltimosDigitos:
                cobranca.charges[0].lastTransaction.payment_profile !== null
                    ? cobranca.charges[0].lastTransaction.payment_profile
                          .cardNumberLastFour
                    : '',
            cartaoValidade: cobranca.charges[0].lastTransaction.cardExpiration,
        },
    }

    console.log('Conta a receber inserir recebimento rest...')
    //Recebimento
    let contaReceberRecorrenciaRecebimento = await contaReceberService.inserirCartaoRecorrenciaRecebimento(
        idContaReceberRecorrencia,
        dataParam
    )

    //Parcela Assinatura
    let dataParamParcelaAssinatura = {
        idContaReceber: idContaReceberRecorrencia,
        idRecebimento: contaReceberRecorrenciaRecebimento.data,
        cpf: cobranca.customer.code,
        referencia: cobranca.charges[0].due_At,
        tipoRecebimento: 'CartaoRecorrencia',
        valorNominal: parseFloat(cobranca.charges[0].amount),
    }
    console.log('Parcela Assinatura inserir rest...')
    await assinaturaService.inserirParcelaAssinatura(dataParamParcelaAssinatura)

    return {
        contaReceberId: idContaReceberRecorrencia,
        idRecebimento: dataParamParcelaAssinatura.idRecebimento,
    }
}
