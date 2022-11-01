const env = process.env.NODE_ENV || 'development'

const params = {
    development: {
        serviceContaReceberUrl: 'http://microservice-contas-a-receber',
        serviceCobrancaUrl: 'http://microservice-webhook-billing',
        serviceAssinaturaUrl: 'http://microservice-assinatura',
        serviceVindiUrl: 'https://sandbox-app.vindi.com.br/api/v1',
        serviceIntegracaoBennerUrl: 'http://microservice-integracao-benner',
        serviceNotaDebitoUrl: 'http://microservice-nota-debito',
        userNameVindi:
            'Rm5uS3Y5bEZPc3IzY1c4SnFQaC1NQ2xmZlRCUXFBem5jbGtkUFgzMFRHZzo=',
        passwordVindi: '',
        awsSnsTopicArn: 'arn:aws:sns:us-east-1:000000000000:fatura-rh-benner',
    },
    staging: {
        serviceContaReceberUrl:
            'http://microservice-contas-a-receber-staging.platform.ferias.in',
        serviceCobrancaUrl:
            'http://microservice-webhook-billing-staging.platform.ferias.in',
        serviceAssinaturaUrl:
            'http://microservice-assinatura-staging.platform.ferias.in',
        serviceVindiUrl: 'https://sandbox-app.vindi.com.br/api/v1',
        serviceIntegracaoBennerUrl:
            'http://microservice-integracao-benner-staging.platform.ferias.in',
        serviceNotaDebitoUrl:
            'http://microservice-nota-debito-staging.platform.ferias.in',
        awsSnsTopicArn: process.env.AWS_SNS_TOPIC_ARN,
        userNameVindi:
            'Rm5uS3Y5bEZPc3IzY1c4SnFQaC1NQ2xmZlRCUXFBem5jbGtkUFgzMFRHZzo=',
        passwordVindi: '',
    },
    production: {
        serviceContaReceberUrl:
            'http://microservice-contas-a-receber-production.platform.ferias.in',
        serviceCobrancaUrl:
            'http://microservice-webhook-billing-production.platform.ferias.in',
        serviceAssinaturaUrl:
            'http://microservice-assinatura-production.platform.ferias.in',
        serviceVindiUrl: 'https://app.vindi.com.br/api/v1',
        serviceIntegracaoBennerUrl:
            'http://microservice-integracao-benner-production.platform.ferias.in',
        serviceNotaDebitoUrl:
            'http://microservice-nota-debito-production.platform.ferias.in',
        awsSnsTopicArn: process.env.AWS_SNS_TOPIC_ARN,
        userNameVindi:
            'TW8zdm1yS1ZWRWdsMWJtRy0tdXVWbldscVY2REZ1YjNaRFFXYlZDNDJ4VTo=',
        passwordVindi: '',
    },
}

module.exports = params[env]
