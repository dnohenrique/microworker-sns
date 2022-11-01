const emitirFatura = require('../features/emitirFatura')
const cancelarFatura = require('../features/cancelarFatura')
const atualizarFatura = require('../features/atualizarFatura')

exports.snsGestaoFaturasVindi = async (event) => {
    console.log('Payload do evento:')
    const evento = event.Records[0]
    console.log(evento)

    const snsMessageEvent = JSON.parse(evento.Sns.Message)

    const contaReceberId = snsMessageEvent.contaReceberId
    const acaoHttp = snsMessageEvent.acaoHttp

    if (acaoHttp.toString().toUpperCase() === 'POST') {
        console.log('Início do fluxo de emissão:')

        await emitirFatura.emitir(contaReceberId)

        console.log('Fim do fluxo de emissão')
    }

    if (acaoHttp.toString().toUpperCase() === 'DELETE') {
        console.log('Início do fluxo de cancelamento:')

        await cancelarFatura.cancelar(contaReceberId)

        console.log('Fim do fluxo de cancelamento')
    }

    if (acaoHttp.toString().toUpperCase() === 'PUT') {
        console.log('Início do fluxo Atualizacao:')

        await atualizarFatura.atualizar(contaReceberId)

        console.log('Fim do fluxo de cancelamento')
    }
}
