const emitirFaturaAvulsa = require('../features/emitirFaturaAvulsa')

exports.processar = async (event) => {
    const evento = event.Records[0]
    const billId = parseInt(evento.Sns.Message)

    console.log('Início do fluxo de emissão fatura avulsa:')

    await emitirFaturaAvulsa.emitir(billId)

    console.log('Fim do fluxo de emissão fatura avulsa')
}
