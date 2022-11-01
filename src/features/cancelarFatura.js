const contaReceberService = require('../services/contaReceberService')
const vindiService = require('../services/vindiService')
const notaDebitoService = require('../services/notaDebitoService')

exports.cancelar = async (contaReceberId) => {
    console.log('Conta receber id:')
    console.log(contaReceberId)
    const contaReceber = await contaReceberService.consultarRecebimentosParaCancelarFaturaVindi(
        contaReceberId
    )

    console.log('Conta a receber:')
    console.log(contaReceber)

    for (const element of contaReceber.recebimentos) {
        const billCancelado = await vindiService.cancelarBill(element.billId)
        console.log('Bill cancelado na vindi:')
        console.log(billCancelado)

        const success = await contaReceberService.atualizarRecebimentoPosCancelamentoFatura(
            contaReceberId,
            element.recebimentoId
        )
        console.log('Cancelou contas a receber:')
        console.log(success)

        const sucessNota = await notaDebitoService.atualizarDivergente(
            contaReceberId
        )

        console.log('Atualizado nota debito divergente:')
        console.log(sucessNota)
    }
}
