// Atualiza cliente no mock
export function apiUpdateCustomerMock(updatedCustomer) {
    const idx = mockCustomerList.findIndex(c => c.id === updatedCustomer.id);
    if (idx !== -1) {
        mockCustomerList[idx] = { ...mockCustomerList[idx], ...updatedCustomer };
    }
    // Se for novo, adiciona
    if (updatedCustomer.id == null) {
        updatedCustomer.id = mockCustomerList.length + 1;
        mockCustomerList.push(updatedCustomer);
    }
    return Promise.resolve(updatedCustomer);
}
import ApiService from './ApiService'
import { mockCustomerListResponse, mockCustomerList } from '@/mock/customerListMockData'
import { mockCustomerData } from '@/mock/customerMockData'

export async function apiGetCustomersList(params) {
    // TODO: Remover mock quando API estiver pronta
    // Simulando delay da API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockCustomerListResponse)
        }, 500)
    })
    
    /* Código original da API:
    return ApiService.fetchDataWithAxios({
        url: '/customers',
        method: 'get',
        params,
    })
    */
}

export async function apiGetCustomer({ id, ...params }) {
    // TODO: Remover mock quando API estiver pronta
    return new Promise((resolve) => {
        setTimeout(() => {
            // Busca cliente na lista mock ou retorna o primeiro como exemplo
            const customer = mockCustomerList.find(c => c.id == id) || mockCustomerList[0]
            
            // Converte para formato esperado pela página de detalhes
            const customerDetail = {
                id: customer.id,
                name: customer.firstName,
                email: customer.email,
                personalInfo: {
                    phoneNumber: customer.phoneNumber,
                    document: customer.document,
                    personType: customer.personType,
                    birthday: customer.birthDate ? new Date(customer.birthDate).toLocaleDateString('pt-BR') : 'N/A',
                    primaryContact: customer.primaryContact,
                    securityKeyword: customer.securityKeyword,
                    clientStatus: customer.clientStatus,
                    // Campos adicionais para compatibilidade
                    location: `${customer.city || 'São Paulo'}, ${customer.state || 'SP'}`,
                    address: customer.address || 'N/A',
                    neighborhood: customer.neighborhood || 'N/A',
                    postcode: customer.postcode || 'N/A',
                    number: customer.number || 'N/A',
                    complement: customer.complement || '',
                },
                lastOnline: Math.floor(Date.now() / 1000) - 3600, // 1 hora atrás
                billing: {
                    billingSameAsClient: customer.billingSameAsClient || true,
                    billingDocument: customer.billingDocument || '',
                    billingEmail: customer.billingEmail || '',
                    paymentMethod: customer.paymentMethod || 'boleto',
                },
                contract: {
                    contractSignDate: customer.contractSignDate || '',
                    observations: customer.observations || '',
                },
                // Remove redes sociais para o contexto juridico
                // personalInfo.facebook, twitter, etc não são relevantes
            }
            
            resolve(customerDetail)
        }, 300)
    })
    
    /* Código original da API:
    return ApiService.fetchDataWithAxios({
        url: `/customers/${id}`,
        method: 'get',
        params,
    })
    */
}

export async function apiGetCustomerLog({ ...params }) {
    return ApiService.fetchDataWithAxios({
        url: `/customer/log`,
        method: 'get',
        params,
    })
}
