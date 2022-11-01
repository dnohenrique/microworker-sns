const contaReceberService = require('../services/contaReceberService')
const vindiService = require('../services/vindiService')
const awsSns = require('../services/awsSns')
const config = require('../settings/config')

exports.emitir = async (contaReceberId) => {
    console.log('Conta receber id:')
    console.log(contaReceberId)

    const contaReceber = await contaReceberService.consultarRecebimentosParaEmissaoFatura(
        contaReceberId
    )
    console.log('Conta a receber:')
    console.log(contaReceber)

    for (const recebimento of contaReceber.recebimentos) {
        if (!recebimento.valorNominal)
            throw new Error('Valor Nominal de um recebimento não pode ser 0')
    }

    const customers = await vindiService.consultarDadosCliente(
        contaReceber.identificadorFiscal
    )
    console.log('Customer vindi:')
    console.log(customers)

    const customer_id = customers[0].id

    //Todo: futuramente consultar no perfil de pagamento da vindi?! (/v1/payment_profiles)
    const payment_method_code = 'online_bank_slip'

    //Código do produto mapeado na vindi
    //Todo: futuramente consultar
    const codigoProduto = 'plano_repasse_turismo'

    for (const element of contaReceber.recebimentos) {
        const payloadBillVindi = {
            customer_id: customer_id,
            payment_method_code: payment_method_code,
            due_at: element.dataVencimento,
            bill_items: [
                {
                    product_code: codigoProduto,
                    amount: element.valorNominal,
                },
            ],
        }

        console.log('Payload para envio Vindi:')
        console.log(payloadBillVindi)

        const bill = await vindiService.cadastrarBill(payloadBillVindi)
        console.log('Bill gerado na Vindi:')
        console.log(bill)

        const billId = bill.id
        const billItemId = bill.bill_items[0].id
        const chargeId = bill.charges[0].id

        const recebimento = {
            billId: billId,
            billItemId: billItemId,
            chargeId: chargeId,
            dataEmissao: new Date().toISOString(),
        }

        console.log('Payload microserivice-contas-a-receber:')
        console.log(recebimento)

        const success = await contaReceberService.atualizarRecebimentoPosEmissaoFatura(
            contaReceberId,
            element.recebimentoId,
            recebimento
        )
        console.log('Atualizou os dados do recebimento após a emissão?')
        console.log(success)

        // criar fatura boleto benner
        if (success) {
            const message = `${contaReceberId}:${element.recebimentoId}`
            console.log('Publica SNS integracao benner:')
            console.log(message)

            await awsSns.publicarSNS(config.variables.awsSnsTopicArn, message)
        }
    }
}
