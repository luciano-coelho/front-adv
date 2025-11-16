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
    
    // Nome/Razão Social (condicional baseado no tipo)
    firstName: z
        .string()
        .min(1, { message: 'Nome/Razão social é obrigatório' })
        .min(2, { message: 'Nome muito curto!' })
        .max(100, { message: 'Nome muito longo!' })
        .refine((value) => /^[a-zA-ZÀ-ÿ\s]*$/.test(value), {
            message: 'Apenas letras são permitidas'
        }),
    lastName: z
        .string()
        .optional(), // Só obrigatório para pessoa física
    
    // CPF/CNPJ (condicional baseado no tipo)
    document: z
        .string()
        .min(1, { message: 'CPF/CNPJ é obrigatório' })
        .refine((value) => {
            const cleaned = value.replace(/\D/g, '')
            return cleaned.length === 11 || cleaned.length === 14
        }, { message: 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos' }),
    
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
    primaryContact: z.enum(['email', 'phone'], { 
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
    billingDocument: z.string().optional().refine((value, ctx) => {
        const billingSame = ctx.parent.billingSameAsClient
        if (!billingSame && !value) {
            return false // Required when billingSameAsClient is false
        }
        if (value && value.length > 0) {
            const cleaned = value.replace(/\D/g, '')
            return cleaned.length === 11 || cleaned.length === 14
        }
        return true
    }, { 
        message: 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos' 
    }),
    billingEmail: z.string().optional().refine((value, ctx) => {
        const billingSame = ctx.parent.billingSameAsClient
        if (!billingSame && !value) {
            return false // Required when billingSameAsClient is false
        }
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
    address: z
        .string()
        .min(1, { message: 'Endereço é obrigatório' })
        .min(5, { message: 'Endereço muito curto!' })
        .max(200, { message: 'Endereço muito longo!' }),
    postcode: z
        .string()
        .min(1, { message: 'CEP é obrigatório' })
        .refine((value) => {
            const cleaned = value.replace(/\D/g, '')
            return cleaned.length === 8
        }, { message: 'CEP deve ter 8 dígitos' }),
    city: z
        .string()
        .min(1, { message: 'Cidade é obrigatória' })
        .min(2, { message: 'Cidade muito curta!' })
        .max(100, { message: 'Cidade muito longa!' })
        .refine((value) => /^[a-zA-ZÀ-ÿ\s]*$/.test(value), {
            message: 'Apenas letras são permitidas'
        }),
    // Situação do cliente (antiga tags)
    clientStatus: z.enum(['ativo', 'inativo', 'prospectado'], { 
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
})

const CustomerForm = (props) => {
    const {
        onFormSubmit,
        defaultValues = {},
        newCustomer = false,
        children,
    } = props

    const {
        handleSubmit,
        reset,
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
                personType: 'fisica', // Pessoa física como padrão
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
                personType: 'fisica', // Pessoa física como padrão
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
                        <OverviewSection control={control} errors={errors} watch={watch} />
                        <AddressSection control={control} errors={errors} />
                    </div>
                    <div className="md:w-[370px] gap-4 flex flex-col">
                        <ClientOriginSection control={control} errors={errors} />
                        <ClientStatusSection control={control} errors={errors} />
                        <ContractDateSection control={control} errors={errors} />
                        <ContractSection control={control} errors={errors} />
                        <BillingSection control={control} errors={errors} watch={watch} />
                        {!newCustomer && (
                            <AccountSection control={control} errors={errors} />
                        )}
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CustomerForm
