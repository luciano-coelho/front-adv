// Mock completo de dados de cliente para testes
const mockCustomerData = {
    // === SEÇÃO OVERVIEW ===
    // Tipo de pessoa
    personType: 'fisica', // 'fisica' ou 'juridica'
    
    // Nome/Razão Social
    firstName: 'Maria Silva Santos',
    
    // CPF/CNPJ 
    document: '123.456.789-00', // CPF para pessoa física
    
    // Data de nascimento (apenas pessoa física)
    birthDate: new Date('1985-03-15'),
    
    // E-mail
    email: 'maria.santos@email.com',
    
    // Contato principal
    primaryContact: 'whatsapp', // 'email' ou 'whatsapp'
    
    // Telefone
    phoneNumber: '(11) 99876-5432',
    
    // Responsável interno
    internalResponsible: 'Dr. João Silva',
    
    // Palavra chave de segurança
    securityKeyword: 'advocacia2024',

    // === SEÇÃO ENDEREÇO ===
    // Estado
    state: 'SP',
    
    // Cidade
    city: 'São Paulo',
    
    // CEP
    postcode: '01234-567',
    
    // Bairro
    neighborhood: 'Vila Madalena',
    
    // Logradouro
    address: 'Rua das Flores, 123',
    
    // Número
    number: '456',
    
    // Complemento (opcional)
    complement: 'Apto 78 - Bloco B',

    // === SEÇÃO FATURAMENTO ===
    // Mesmo dados do cliente?
    billingSameAsClient: false,
    
    // CPF/CNPJ para faturamento (quando différente)
    billingDocument: '987.654.321-00',
    
    // E-mail para cobrança (quando différente)
    billingEmail: 'financeiro@empresa.com',
    
    // Forma de pagamento
    paymentMethod: 'boleto', // 'boleto', 'cartao', 'pix', 'especie'

    // === SEÇÃO ORIGEM DO CLIENTE ===
    // Como chegou até nós
    clientOrigin: 'instagram', // 'instagram', 'site', 'google', 'indicacao', 'convenio', 'parceria'

    // === SEÇÃO SITUAÇÃO DO CLIENTE ===
    // Status atual
    clientStatus: 'ativo', // 'ativo', 'inativo', 'prospectado'

    // === SEÇÃO DATA DE ASSINATURA ===
    // Data do contrato
    contractSignDate: '2025-11-15',

    // === SEÇÃO OBSERVAÇÕES ===
    // Observações gerais
    observations: 'Cliente muito atencioso, prefere contato por WhatsApp. Processo de divórcio consensual em andamento.',

    // === SEÇÃO DOCUMENTOS ===
    // Arquivos (mock - em produção seria File objects)
    contractFile: null, // Aqui seriam os arquivos uploadados
}

// Exemplo de mock para Pessoa Jurídica
const mockCompanyData = {
    // === DADOS BÁSICOS ===
    personType: 'juridica',
    firstName: 'Silva Advocacia Ltda',
    document: '12.345.678/0001-90', // CNPJ
    birthDate: undefined, // Pessoa jurídica não tem data de nascimento
    email: 'contato@silvaadvocacia.com.br',
    primaryContact: 'email',
    phoneNumber: '(11) 3456-7890',
    internalResponsible: 'Dra. Ana Paula Silva',
    securityKeyword: 'escritorio123',

    // === ENDEREÇO ===
    state: 'RJ',
    city: 'Rio de Janeiro',
    postcode: '22070-900',
    neighborhood: 'Copacabana',
    address: 'Avenida Atlântica, 1500',
    number: '301',
    complement: 'Sala 1205',

    // === FATURAMENTO ===
    billingSameAsClient: true,
    billingDocument: '', // Vazio quando igual ao cliente
    billingEmail: '', // Vazio quando igual ao cliente
    paymentMethod: 'pix',

    // === ORIGEM E STATUS ===
    clientOrigin: 'indicacao',
    clientStatus: 'ativo',

    // === CONTRATO ===
    contractSignDate: '2025-10-20',

    // === OBSERVAÇÕES ===
    observations: 'Empresa parceira. Processos trabalhistas recorrentes. Contato preferencial com a sócia Dra. Ana.',
}

// Exemplo de mock para cliente inativo
const mockInactiveClient = {
    personType: 'fisica',
    firstName: 'Carlos Oliveira',
    document: '456.789.123-45',
    birthDate: new Date('1978-07-22'),
    email: 'carlos.oliveira@email.com',
    primaryContact: 'email',
    phoneNumber: '(21) 98765-4321',
    internalResponsible: 'Dr. Pedro Costa',
    securityKeyword: 'advogado456',
    state: 'MG',
    city: 'Belo Horizonte',
    postcode: '30112-000',
    neighborhood: 'Centro',
    address: 'Rua da Bahia, 789',
    number: '1012',
    complement: '',
    billingSameAsClient: true,
    billingDocument: '',
    billingEmail: '',
    paymentMethod: 'especie',
    clientOrigin: 'site',
    clientStatus: 'inativo', // Cliente inativo
    contractSignDate: '2023-05-10',
    observations: 'Cliente encerrou processo. Manter contato para futuras demandas jurídicas.',
}

// Exemplo de mock para prospecto
const mockProspect = {
    personType: 'fisica',
    firstName: 'Fernanda Costa Lima',
    document: '789.123.456-78',
    birthDate: new Date('1992-12-03'),
    email: 'fernanda.lima@gmail.com',
    primaryContact: 'whatsapp',
    phoneNumber: '(85) 99123-4567',
    internalResponsible: 'Dra. Lucia Mendes',
    securityKeyword: 'consulta2024',
    state: 'CE',
    city: 'Fortaleza',
    postcode: '60160-230',
    neighborhood: 'Aldeota',
    address: 'Rua Santos Dumont, 456',
    number: '789',
    complement: 'Casa',
    billingSameAsClient: true,
    billingDocument: '',
    billingEmail: '',
    paymentMethod: 'cartao',
    clientOrigin: 'google',
    clientStatus: 'prospectado', // Ainda em prospecção
    contractSignDate: '', // Sem data ainda
    observations: 'Interessada em consultoria trabalhista. Aguardando definição de valores e cronograma.',
}

export {
    mockCustomerData,
    mockCompanyData, 
    mockInactiveClient,
    mockProspect
}

// Para usar qualquer um dos mocks:
export default mockCustomerData