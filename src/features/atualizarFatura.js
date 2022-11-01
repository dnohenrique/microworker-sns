const contaReceberService = require('../services/contaReceberService')
const vindiService = require('../services/vindiService')

exports.atualizar = async (contaReceberId) => {
    console.log('Conta receber id:')
    console.log(contaReceberId)
    const contaReceber = await contaReceberService.consultarRecebimentosPendenteAtualizacaoVencimento(
        contaReceberId
    )

    console.log('Conta a receber:')
    console.log(contaReceber)

    for (const recebimento of contaReceber.recebimentos) {
        if (!recebimento.valorNominal)
            throw new Error('Valor Nominal de um recebimento não pode ser 0')

        const payloadUpdateBillVindi = {
            due_at: recebimento.dataVencimento,
        }

        console.log('Payload para envio Vindi:')
        console.log(payloadUpdateBillVindi)

        const billAtualizado = await vindiService.atualizarDataVencimento(
            recebimento.chargeId,
            payloadUpdateBillVindi
        )
        console.log('Bill Atualizado na vindi:')
        console.log(billAtualizado)

        const success = await contaReceberService.atualizarSituacaoRecebimentoPosAtualizacaoDataVencimento(
            contaReceberId,
            recebimento.recebimentoId
        )
        console.log('Atualizou o conta na vindi:')
        console.log(success)
    }
}
