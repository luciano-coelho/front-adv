export const featuresList = [
    {
        id: 'taskManagement',
        description: {
            basic: 'Gestão de tarefas',
            standard: 'Gestão de tarefas',
            pro: 'Gestão de tarefas',
        },
    },
    {
        id: 'managementTools',
        description: {
            basic: 'Ferramentas básicas de gestão',
            standard: 'Ferramentas avançadas de gestão',
            pro: 'Ferramentas avançadas de gestão',
        },
    },
    {
        id: 'reporting',
        description: {
            basic: 'Gerador de relatórios',
            standard: 'Gerador de relatórios',
            pro: 'Gerador detalhado de relatórios',
        },
    },
    {
        id: 'support',
        description: {
            basic: 'Suporte por email',
            standard: 'Suporte por chat e email',
            pro: 'Suporte 24/7 por chat e email',
        },
    },
    {
        id: 'fileSharing',
        description: {
            basic: 'Compartilhamento de arquivos',
            standard: 'Compartilhamento de arquivos',
            pro: 'Compartilhamento de arquivos',
        },
    },
    {
        id: 'advancedSecurity',
        description: {
            basic: 'Protocolos avançados de segurança',
            standard: 'Protocolos avançados de segurança',
            pro: 'Protocolos avançados de segurança',
        },
    },
    {
        id: 'customIntegrations',
        description: {
            basic: 'Integração com serviços terceirizados',
            standard: 'Integração com serviços terceirizados',
            pro: 'Integração com serviços terceirizados',
        },
    },
]

export const questionList = {
    subscription: [
        {
            title: 'Como faço para assinar um plano?',
            content:
                'Selecione o plano acima com o seu plano de assinatura preferido e siga as instruções na tela para criar uma conta e inserir seus dados de pagamento.',
            defaultExpand: true,
        },
        {
            title: 'Posso cancelar minha assinatura?',
            content:
                'Sim, você tem a flexibilidade de cancelar sua assinatura a qualquer momento. Para cancelar, simplesmente entre em sua conta, navegue para a seção "Assinatura" e siga as instruções para cancelar seu plano. Seu cancelamento entrará em vigor no final do seu ciclo de cobrança atual.',
            defaultExpand: false,
        },

        {
            title: 'Posso trocar meu plano de assinatura?',
            content:
                'Absolutamente, você pode alternar entre os planos mensal e anual a qualquer momento. Para alterar seu plano de assinatura, faça login em sua conta, vá para a seção "Assinatura", selecione o plano para o qual deseja trocar e siga as instruções. Seu novo plano entrará em vigor imediatamente.',
            defaultExpand: false,
        },
        {
            title: 'Vocês oferecem um teste gratuito?',
            content:
                'Sim, oferecemos um teste gratuito de 14 dias para novos usuários. Durante este período, você pode acessar todos os recursos do nosso plano de assinatura. Se continuar após o teste, você será cobrado com base no plano selecionado.',
            defaultExpand: false,
        },
        {
            title: 'Como sei quando minha assinatura está prestes a renovar?',
            content:
                'Você receberá uma notificação por email alguns dias antes da renovação da sua assinatura, lembrando-o da próxima cobrança e oferecendo a opção de fazer alterações necessárias.',
            defaultExpand: false,
        },
        {
            title: 'Há descontos para estudantes ou organizações sem fins lucrativos?',
            content:
                'Sim, oferecemos descontos especiais para estudantes e organizações sem fins lucrativos. Entre em contato com nossa equipe de suporte com a documentação relevante para solicitar esses descontos.',
            defaultExpand: false,
        },
    ],
    billing: [
        {
            title: 'Que métodos de pagamento vocês aceitam?',
            content:
                'Nos esforçamos para tornar o processo de pagamento o mais conveniente possível, aceitando uma variedade de métodos de pagamento. Estes incluem cartões de crédito e débito principais como Visa, MasterCard e American Express, bem como PayPal. Dependendo da sua localização, métodos de pagamento regionais adicionais também podem estar disponíveis.',
            defaultExpand: true,
        },
        {
            title: 'O que acontece se meu pagamento falhar?',
            content:
                'Se seu pagamento falhar, nós o notificaremos por email. Você então terá um período de carência de 7 dias para atualizar suas informações de pagamento. Se o problema de pagamento não for resolvido dentro deste período, sua assinatura será temporariamente suspensa até que o pagamento seja processado com sucesso.',
            defaultExpand: false,
        },
        {
            title: 'Como atualizo minhas informações de pagamento?',
            content:
                'Para atualizar suas informações de pagamento, faça login em sua conta, vá para a seção "Cobrança" e insira seus novos detalhes de pagamento. Certifique-se de salvar as alterações para garantir o serviço contínuo.',
            defaultExpand: false,
        },
        {
            title: 'Receberei um reembolso se cancelar minha assinatura?',
            content:
                'As políticas de reembolso variam dependendo do seu tipo de assinatura. Para nosso Plano Mensal, não oferecemos reembolsos. No entanto, para o Plano Anual, você pode ser elegível para um reembolso proporcional se cancelar dentro dos primeiros 30 dias de sua assinatura. Entre em contato com nossa equipe de suporte para assistência com este processo.',
            defaultExpand: false,
        },
    ],
    others: [
        {
            title: 'Como entro em contato com o suporte ao cliente?',
            content:
                'Nossa equipe de suporte ao cliente está aqui para ajudar com qualquer dúvida ou problema que você possa ter. Você pode nos contatar enviando um email para support@ecme.com, ligando para nossa linha de suporte no 1-800-123-4567, ou usando o recurso de chat ao vivo em nosso site. Estamos comprometidos em fornecer assistência rápida e eficaz.',
            defaultExpand: true,
        },
        {
            title: 'Como altero os detalhes da minha conta?',
            content:
                'Para atualizar os detalhes da sua conta, faça login em sua conta, navegue para a seção "Segurança" e faça as alterações necessárias. Certifique-se de salvar suas atualizações.',
            defaultExpand: false,
        },
        {
            title: 'Minhas informações pessoais estão seguras?',
            content:
                'Sim, priorizamos a segurança de suas informações pessoais. Nosso site usa criptografia e medidas de segurança padrão da indústria. Consulte nossa Política de Privacidade para mais detalhes sobre como protegemos seus dados.',
            defaultExpand: false,
        },
    ],
}

export const questionCategory = {
    subscription: 'Detalhes da assinatura',
    billing: 'Cobrança e pagamentos',
    others: 'Outros',
}
