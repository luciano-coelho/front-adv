import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import AddressSection from './AddressSection'
import BillingSection from './BillingSection'
import ClientOriginSection from './ClientOriginSection'
import ClientStatusSection from './ClientStatusSection'
import ContractDateSection from './ContractDateSection'
import ContractSection from './ContractSection'
import ObservationsSection from './ObservationsSection'
import AccountSection from './AccountSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const validationSchema = z.object({
    // Tipo de pessoa
    personType: z.enum(['fisica', 'juridica'], { 
        required_error: 'Tipo de pessoa é obrigatório',
        invalid_type_error: 'Selecione um tipo válido' 
    }),
    
    // Nome Completo/Razão Social
    firstName: z
        .string()
        .min(1, { message: 'Nome/Razão social é obrigatório' })
        .min(2, { message: 'Nome muito curto!' })
        .max(100, { message: 'Nome muito longo!' })
        .refine((value) => /^[a-zA-ZÀ-ÿ\s]*$/.test(value), {
            message: 'Apenas letras são permitidas'
        }),
    
    // CPF/CNPJ (condicional baseado no tipo)
    document: z
        .string()
        .min(1, { message: 'CPF/CNPJ é obrigatório' })
        .refine((value) => {
            const cleaned = value.replace(/\D/g, '')
            return cleaned.length === 11 || cleaned.length === 14
        }, { message: 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos' }),
    
    // Data de nascimento (opcional, só para pessoa física)
    birthDate: z
        .union([z.date(), z.null(), z.string().optional()])
        .optional()
        .refine((value, ctx) => {
            if (!value) return true;
            let personType = 'fisica';
            try {
                personType = ctx?.data?.personType ?? ctx?.parent?.personType ?? 'fisica';
            } catch (e) {}
            if (personType === 'fisica' && value instanceof Date) {
                const today = new Date()
                const age = today.getFullYear() - value.getFullYear()
                return age >= 0 && age <= 120
            }
            return true
        }, { message: 'Data de nascimento inválida' }),
    
    // E-mail
    email: z
        .string()
        .min(1, { message: 'E-mail é obrigatório' })
        .email({ message: 'E-mail inválido' })
        .refine((value) => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            return emailRegex.test(value)
        }, { message: 'Formato de e-mail inválido' }),
    
    // Contato principal
    primaryContact: z.enum(['email', 'whatsapp'], { 
        required_error: 'Contato principal é obrigatório',
        invalid_type_error: 'Selecione um tipo de contato válido' 
    }),
    
    phoneNumber: z
        .string()
        .min(1, { message: 'Por favor, digite seu número de telefone' })
        .refine((value) => {
            const cleaned = value.replace(/\D/g, '')
            return cleaned.length >= 10 && cleaned.length <= 11
        }, { message: 'Número de telefone inválido' }),
    
    // Responsável interno
    internalResponsible: z.string().min(1, { message: 'Responsável interno é obrigatório' }),
    
    // Dados de faturamento
    billingSameAsClient: z.boolean().default(true),
    billingDocument: z.string().optional().refine((value) => {
        if (value && value.length > 0) {
            const cleaned = value.replace(/\D/g, '')
            return cleaned.length === 11 || cleaned.length === 14
        }
        return true
    }, { 
        message: 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos' 
    }),
    billingEmail: z.string().optional().refine((value) => {
        if (value && value.length > 0) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            return emailRegex.test(value)
        }
        return true
    }, { 
        message: 'E-mail para cobrança inválido' 
    }),
    paymentMethod: z.enum(['boleto', 'cartao', 'pix', 'especie'], { 
        required_error: 'Forma de pagamento é obrigatória',
        invalid_type_error: 'Selecione uma forma de pagamento válida' 
    }),
    
    // Palavra chave de segurança
    securityKeyword: z
        .string()
        .min(1, { message: 'Palavra chave é obrigatória' })
        .min(3, { message: 'Palavra chave muito curta!' })
        .max(50, { message: 'Palavra chave muito longa!' }),
    state: z.string().min(1, { message: 'Por favor, selecione um estado' }),
    
    city: z
        .string()
        .min(1, { message: 'Cidade é obrigatória' })
        .min(2, { message: 'Cidade muito curta!' })
        .max(100, { message: 'Cidade muito longa!' })
        .refine((value) => /^[a-zA-ZÀ-ÿ\s]*$/.test(value), {
            message: 'Apenas letras são permitidas'
        }),
    
    postcode: z
        .string()
        .min(1, { message: 'CEP é obrigatório' })
        .refine((value) => {
            const cleaned = value.replace(/\D/g, '')
            return cleaned.length === 8
        }, { message: 'CEP deve ter 8 dígitos' }),
    
    neighborhood: z
        .string()
        .min(1, { message: 'Bairro é obrigatório' })
        .min(2, { message: 'Bairro muito curto!' })
        .max(100, { message: 'Bairro muito longo!' }),
    
    address: z
        .string()
        .min(1, { message: 'Logradouro é obrigatório' })
        .min(5, { message: 'Logradouro muito curto!' })
        .max(200, { message: 'Logradouro muito longo!' }),
    
    number: z
        .string()
        .min(1, { message: 'Número é obrigatório' })
        .max(10, { message: 'Número muito longo!' }),
    
    complement: z
        .string()
        .max(100, { message: 'Complemento muito longo!' })
        .optional(),
    // Situação do cliente (antiga tags)
    clientStatus: z.enum(['ativo', 'inativo', 'em-atendimento', 'prospectado'], { 
        required_error: 'Situação do cliente é obrigatória',
        invalid_type_error: 'Selecione uma situação válida' 
    }),
    
    // Origem do cliente
    clientOrigin: z.enum(['instagram', 'site', 'google', 'indicacao', 'convenio', 'parceria'], { 
        required_error: 'Origem do cliente é obrigatória',
        invalid_type_error: 'Selecione uma origem válida' 
    }),
    
    // Contrato de honorários
    contractFile: z.any().optional(), // Para upload de arquivo
    contractSignDate: z.string().optional().refine((value) => {
        if (value) {
            const date = new Date(value)
            return !isNaN(date.getTime())
        }
        return true
    }, { message: 'Data de assinatura inválida' }),
    
    observations: z.string().optional().refine((value) => {
        if (!value) return true
        return value.length <= 150
    }, { message: 'Observações devem ter no máximo 150 caracteres' }),
})

const CustomerForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = {},
        newCustomer = false,
        viewMode = false, // Novo prop para modo visualização
        children,
    } = props

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        control,
        watch,
    } = useForm({
        defaultValues: {
            ...{
                banAccount: false,
                accountVerified: true,
                dialCode: '+55', // Brasil como padrão
                state: 'SP', // São Paulo como padrão
                city: '', // Cidade vazia
                neighborhood: '', // Bairro vazio
                address: '', // Logradouro vazio
                number: '', // Número vazio
                complement: '', // Complemento vazio
                postcode: '', // CEP vazio
                personType: 'fisica', // Pessoa física como padrão
                birthDate: null, // Data de nascimento vazia por padrão
                primaryContact: 'email', // E-mail como contato principal padrão
                billingSameAsClient: true, // Dados de faturamento iguais por padrão
                internalResponsible: 'Advogado Principal', // Temporário até implementar seleção
                clientStatus: 'prospectado', // Prospectado como padrão
                clientOrigin: 'site', // Site como origem padrão
                paymentMethod: 'boleto', // Boleto como padrão
            },
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            // Garante que os valores padrão sejam mantidos
            const mergedDefaults = {
                dialCode: '+55', // Brasil como padrão
                state: 'SP', // São Paulo como padrão
                city: '', // Cidade vazia
                neighborhood: '', // Bairro vazio
                address: '', // Logradouro vazio
                number: '', // Número vazio
                complement: '', // Complemento vazio
                postcode: '', // CEP vazio
                personType: 'fisica', // Pessoa física como padrão
                birthDate: null, // Data de nascimento vazia por padrão
                primaryContact: 'email', // E-mail como contato principal padrão
                billingSameAsClient: true, // Dados de faturamento iguais por padrão
                internalResponsible: 'Advogado Principal', // Temporário
                clientStatus: 'prospectado', // Prospectado como padrão
                clientOrigin: 'site', // Site como origem padrão
                paymentMethod: 'boleto', // Boleto como padrão
                ...defaultValues,
            }
            reset(mergedDefaults)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values) => {
        // Corrige birthDate para null se não for Date
        if (values.birthDate && !(values.birthDate instanceof Date)) {
            values.birthDate = null;
        }
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection control={control} errors={errors} watch={watch} viewMode={viewMode} />
                        <AddressSection control={control} errors={errors} viewMode={viewMode} />
                        {/* <BillingSection control={control} errors={errors} watch={watch} setValue={setValue} viewMode={viewMode} /> */}
                    </div>
                    <div className="md:w-[370px] gap-4 flex flex-col">
                        <ClientOriginSection control={control} errors={errors} viewMode={viewMode} />
                        <ClientStatusSection control={control} errors={errors} viewMode={viewMode} />
                        {/* <ContractDateSection control={control} errors={errors} viewMode={viewMode} /> */}
                        <ObservationsSection control={control} errors={errors} viewMode={viewMode} />
                        <ContractSection control={control} errors={errors} viewMode={viewMode} />
                        {!newCustomer && (
                            <AccountSection control={control} errors={errors} viewMode={viewMode} />
                        )}
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CustomerForm
