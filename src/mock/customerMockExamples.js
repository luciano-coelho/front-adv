// Exemplo de como aplicar os dados mock no CustomerForm
import { mockCustomerData, mockCompanyData, mockInactiveClient, mockProspect } from '@/mock/customerMockData'

// === EXEMPLO DE USO NO COMPONENTE ===
/*
import { mockCustomerData } from '@/mock/customerMockData'

const CustomerCreateView = () => {
    const handleFormSubmit = (values) => {
        console.log('📋 Dados do formulário:', values)
    }

    return (
        <CustomerForm
            newCustomer={true}
            defaultValues={mockCustomerData} // 👈 Aplicando o mock aqui
            onFormSubmit={handleFormSubmit}
        >
            <Button type="submit">Salvar Cliente</Button>
        </CustomerForm>
    )
}
*/

// === DADOS DE EXEMPLO DISPONÍVEIS ===

// 1. PESSOA FÍSICA ATIVA - Cliente completo
console.log('🧑 Pessoa Física Ativa:', mockCustomerData)

// 2. PESSOA JURÍDICA - Empresa
console.log('🏢 Pessoa Jurídica:', mockCompanyData)

// 3. CLIENTE INATIVO - Ex-cliente
console.log('😴 Cliente Inativo:', mockInactiveClient)

// 4. PROSPECTO - Em negociação
console.log('🎯 Prospecto:', mockProspect)

// === ESTRUTURA COMPLETA DOS DADOS ===
/*
SEÇÕES DO FORMULÁRIO COM TODOS OS CAMPOS:

📋 OVERVIEW SECTION:
- personType: 'fisica' | 'juridica'
- firstName: string (Nome/Razão Social)
- document: string (CPF/CNPJ)
- birthDate: Date | undefined (só pessoa física)
- email: string
- primaryContact: 'email' | 'whatsapp'
- phoneNumber: string
- internalResponsible: string
- securityKeyword: string

🏠 ADDRESS SECTION:
- state: string (sigla do estado)
- city: string
- postcode: string (CEP)
- neighborhood: string
- address: string (logradouro)
- number: string
- complement: string (opcional)

💰 BILLING SECTION:
- billingSameAsClient: boolean
- billingDocument: string (quando différente)
- billingEmail: string (quando différente)
- paymentMethod: 'boleto' | 'cartao' | 'pix' | 'especie'

📞 CLIENT ORIGIN SECTION:
- clientOrigin: 'instagram' | 'site' | 'google' | 'indicacao' | 'convenio' | 'parceria'

📊 CLIENT STATUS SECTION:
- clientStatus: 'ativo' | 'inativo' | 'prospectado'

📅 CONTRACT DATE SECTION:
- contractSignDate: string (formato YYYY-MM-DD)

📝 OBSERVATIONS SECTION:
- observations: string (máximo 150 caracteres)

📎 CONTRACT SECTION:
- contractFile: File | null (arquivos uploadados)
*/

export {
    mockCustomerData,
    mockCompanyData,
    mockInactiveClient, 
    mockProspect
}