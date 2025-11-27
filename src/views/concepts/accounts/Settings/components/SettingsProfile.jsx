import { useMemo, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import Dialog from '@/components/ui/Dialog'
import Checkbox from '@/components/ui/Checkbox'
import { Form, FormItem } from '@/components/ui/Form'
import { countryList } from '@/constants/countries.constant'
import { components } from 'react-select'
import { apiGetSettingsProfile } from '@/services/AccontsService'
import sleep from '@/utils/sleep'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const oabStates = [
    { value: 'AC', label: 'Acre (AC)' },
    { value: 'AL', label: 'Alagoas (AL)' },
    { value: 'AP', label: 'Amapá (AP)' },
    { value: 'AM', label: 'Amazonas (AM)' },
    { value: 'BA', label: 'Bahia (BA)' },
    { value: 'CE', label: 'Ceará (CE)' },
    { value: 'DF', label: 'Distrito Federal (DF)' },
    { value: 'ES', label: 'Espírito Santo (ES)' },
    { value: 'GO', label: 'Goiás (GO)' },
    { value: 'MA', label: 'Maranhão (MA)' },
    { value: 'MT', label: 'Mato Grosso (MT)' },
    { value: 'MS', label: 'Mato Grosso do Sul (MS)' },
    { value: 'MG', label: 'Minas Gerais (MG)' },
    { value: 'PA', label: 'Pará (PA)' },
    { value: 'PB', label: 'Paraíba (PB)' },
    { value: 'PR', label: 'Paraná (PR)' },
    { value: 'PE', label: 'Pernambuco (PE)' },
    { value: 'PI', label: 'Piauí (PI)' },
    { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
    { value: 'RN', label: 'Rio Grande do Norte (RN)' },
    { value: 'RS', label: 'Rio Grande do Sul (RS)' },
    { value: 'RO', label: 'Rondônia (RO)' },
    { value: 'RR', label: 'Roraima (RR)' },
    { value: 'SC', label: 'Santa Catarina (SC)' },
    { value: 'SP', label: 'São Paulo (SP)' },
    { value: 'SE', label: 'Sergipe (SE)' },
    { value: 'TO', label: 'Tocantins (TO)' }
]

const oabStatusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'suspenso', label: 'Suspenso' }
]

const positionOptions = [
    { value: 'socio_administrador', label: 'Sócio Administrador' },
    { value: 'coordenador', label: 'Coordenador' },
    { value: 'gestor', label: 'Gestor' },
    { value: 'advogado_senior', label: 'Advogado Sênior' },
    { value: 'advogado_pleno', label: 'Advogado Pleno' },
    { value: 'advogado_junior', label: 'Advogado Júnior' },
    { value: 'estagiario', label: 'Estagiário' },
    { value: 'assistente_juridico', label: 'Assistente Jurídico' },
    { value: 'secretario', label: 'Secretário(a)' },
    { value: 'outro', label: 'Outro' }
]

const brazilStates = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
]

const { Control } = components

const validationSchema = z.object({
    // 1. Identificação do ADMIN
    fullName: z.string().min(1, { message: 'Nome completo é obrigatório' }),
    email: z
        .string()
        .min(1, { message: 'Email profissional é obrigatório' })
        .email({ message: 'Email inválido' }),
    dialCode: z.string().min(1, { message: 'Selecione o código do país' }),
    phoneNumber: z
        .string()
        .min(1, { message: 'Digite o número do telefone/WhatsApp' }),
    position: z.string().min(1, { message: 'Cargo/Função é obrigatório' }),
    oabNumber: z
        .string()
        .min(1, { message: 'Número da OAB é obrigatório' }),
    oabState: z.string().min(1, { message: 'UF da OAB é obrigatória' }),
    oabStatus: z.string().min(1, { message: 'Situação da OAB é obrigatória' }),
    cpf: z.string().optional(),
    img: z.string().optional(),

    // 2. Dados do Escritório (todos opcionais)
    officeName: z.string().optional(),
    companyName: z.string().optional(),
    cnpj: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postcode: z.string().optional(),
    officePhone: z.string().optional(),
    officeEmail: z.string().optional(),
    website: z.string().optional(),
    socialMedia: z.string().optional(),

    // 3. Aceite dos termos
    acceptTerms: z.boolean().refine(val => val === true, {
        message: 'Você deve aceitar os termos de uso para continuar'
    }),
})

const CustomSelectOption = (props) => {
    return (
        <DefaultOption
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    {props.variant === 'country' && <span>{label}</span>}
                    {props.variant === 'phone' && <span>{data.dialCode}</span>}
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.value}.png`}
                />
            )}
            {children}
        </Control>
    )
}

const SettingsProfile = () => {
    const [termsModalOpen, setTermsModalOpen] = useState(false)
    
    const { data, mutate } = useSWR(
        '/api/settings/profile/',
        () => apiGetSettingsProfile(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const dialCodeList = useMemo(() => {
        const newCountryList = JSON.parse(JSON.stringify(countryList))

        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    const beforeUpload = (files) => {
        let valid = true

        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Por favor, envie um arquivo .jpeg ou .png!'
                }
            }
        }

        return valid
    }

    const formatPhoneNumber = (value) => {
        if (!value) return ''
        
        // Remove tudo que não é número
        const numbers = value.replace(/\D/g, '')
        
        // Aplica a máscara (xx) xxxxx-xxxx
        if (numbers.length <= 2) {
            return `(${numbers}`
        } else if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
        } else if (numbers.length <= 11) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
        } else {
            // Limita a 11 dígitos
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
        }
    }

    const formatCPF = (value) => {
        if (!value) return ''
        const numbers = value.replace(/\D/g, '')
        
        if (numbers.length <= 3) {
            return numbers
        } else if (numbers.length <= 6) {
            return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
        } else if (numbers.length <= 9) {
            return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
        } else {
            return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
        }
    }

    const formatCNPJ = (value) => {
        if (!value) return ''
        const numbers = value.replace(/\D/g, '')
        
        if (numbers.length <= 2) {
            return numbers
        } else if (numbers.length <= 5) {
            return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
        } else if (numbers.length <= 8) {
            return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
        } else if (numbers.length <= 12) {
            return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
        } else {
            return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
        }
    }

    const formatCEP = (value) => {
        if (!value) return ''
        const numbers = value.replace(/\D/g, '')
        
        if (numbers.length <= 5) {
            return numbers
        } else {
            return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
        }
    }

    const formatOAB = (value) => {
        if (!value) return ''
        const numbers = value.replace(/\D/g, '')
        return numbers.slice(0, 6) // Limita a 6 dígitos para OAB
    }

    const validateEmail = (value) => {
        if (!value) return ''
        // Remove espaços e caracteres inválidos para email
        return value.replace(/[^a-zA-Z0-9@._-]/g, '').toLowerCase()
    }

    const validateWebsite = (value) => {
        if (!value) return ''
        // Se não começar com http:// ou https://, adiciona https://
        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
            return `https://${value}`
        }
        return value
    }

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
        setValue,
    } = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            dialCode: '+55', // Brasil como padrão
        }
    })

    // Força o Brasil como padrão na primeira renderização
    useEffect(() => {
        setValue('dialCode', '+55')
    }, [setValue])

    useEffect(() => {
        // Define Brasil como padrão sempre, independente se há dados ou não
        const brasilDialCode = '+55'
        
        if (data) {
            reset({
                ...data,
                dialCode: brasilDialCode, // Força Brasil como padrão
            })
        } else {
            // Define Brasil como padrão quando não há dados
            reset({
                dialCode: brasilDialCode
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const onSubmit = async (values) => {
        // Log para capturar dados do formulário para validação da API
        console.log('=== DADOS DO FORMULÁRIO DE PERFIL ===')
        console.log('Dados brutos:', values)
        console.log('JSON formatado:', JSON.stringify(values, null, 2))
        console.log('=====================================')
        
        if (!values.acceptTerms) {
            toast.push(
                <Notification 
                    title="Termos de Uso" 
                    type="warning"
                >
                    Você precisa aceitar os termos de uso para continuar
                </Notification>
            )
            return
        }

        await sleep(500)
        if (data) {
            mutate({ ...data, ...values }, false)
            toast.push(
                <Notification 
                    title="Perfil Atualizado" 
                    type="success"
                >
                    Suas informações foram salvas com sucesso
                </Notification>
            )
        }
    }

    const handleTermsAccept = (accept) => {
        if (!accept) {
            toast.push(
                <Notification 
                    title="Termos Obrigatórios" 
                    type="warning"
                >
                    Você precisa aceitar os termos de uso para utilizar o sistema
                </Notification>
            )
            return
        }
        setTermsModalOpen(false)
    }

    return (
        <>
            <h3 className="mb-8">Informações de Cadastro</h3>

                <h4 className="mb-6 text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Dados do Advogado
                </h4>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
                {/* 1. IDENTIFICAÇÃO DO ADMIN */}
                <div className="mb-12">
                    
                    {/* Foto/Avatar */}
                    <div className="mb-6">
                        {/* Upload de foto removido conforme solicitado */}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <FormItem
                            label="Nome Completo *"
                            invalid={Boolean(errors.fullName)}
                            errorMessage={errors.fullName?.message}
                        >
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Digite seu nome completo"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="E-mail Profissional *"
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        placeholder="joao.silva@escritorio.com.br"
                                        value={validateEmail(field.value || '')}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={field.onBlur}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="mb-4">
                        <label className="form-label mb-2">Telefone/WhatsApp *</label>
                        <FormItem
                            className="w-full"
                            invalid={Boolean(errors.phoneNumber)}
                            errorMessage={errors.phoneNumber?.message}
                        >
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="(11) 3333-4444"
                                        value={formatPhoneNumber(field.value || '')}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={field.onBlur}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <FormItem
                            label="Cargo/Função *"
                            invalid={Boolean(errors.position)}
                            errorMessage={errors.position?.message}
                        >
                            <Controller
                                name="position"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={positionOptions}
                                        {...field}
                                        placeholder="Selecione o cargo"
                                        value={positionOptions.filter(
                                            (option) => option.value === field.value
                                        )}
                                        onChange={(option) => field.onChange(option?.value)}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="CPF"
                            invalid={Boolean(errors.cpf)}
                            errorMessage={errors.cpf?.message}
                        >
                            <Controller
                                name="cpf"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="123.456.789-00"
                                        value={formatCPF(field.value || '')}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={field.onBlur}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* OAB - Campos condicionais para advogados */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-3 text-gray-700">
                            Informações OAB
                        </h5>
                        <div className="grid md:grid-cols-3 gap-4">
                            <FormItem
                                label="Número OAB *"
                                invalid={Boolean(errors.oabNumber)}
                                errorMessage={errors.oabNumber?.message}
                            >
                                <Controller
                                    name="oabNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            placeholder="123456"
                                            value={formatOAB(field.value || '')}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="UF da OAB *"
                                invalid={Boolean(errors.oabState)}
                                errorMessage={errors.oabState?.message}
                            >
                                <Controller
                                    name="oabState"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={oabStates}
                                            {...field}
                                            placeholder="Selecione o estado"
                                            value={oabStates.filter(
                                                (option) => option.value === field.value
                                            )}
                                            onChange={(option) => field.onChange(option?.value)}
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Situação OAB *"
                                invalid={Boolean(errors.oabStatus)}
                                errorMessage={errors.oabStatus?.message}
                            >
                                <Controller
                                    name="oabStatus"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={oabStatusOptions}
                                            {...field}
                                            placeholder="Status"
                                            value={oabStatusOptions.filter(
                                                (option) => option.value === field.value
                                            )}
                                            onChange={(option) => field.onChange(option?.value)}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </div>
                </div>

                {/* 2. DADOS DO ESCRITÓRIO */}
                <div className="mb-12">
                    <h4 className="mb-6 text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Dados do Escritório
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <FormItem
                            label="Nome Fantasia"
                            invalid={Boolean(errors.officeName)}
                            errorMessage={errors.officeName?.message}
                        >
                            <Controller
                                name="officeName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Escritório Advocacia Silva & Associados"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Razão Social"
                            invalid={Boolean(errors.companyName)}
                            errorMessage={errors.companyName?.message}
                        >
                            <Controller
                                name="companyName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Silva & Associados Sociedade de Advogados"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <FormItem
                        label="CNPJ"
                        invalid={Boolean(errors.cnpj)}
                        errorMessage={errors.cnpj?.message}
                        className="mb-4"
                    >
                        <Controller
                            name="cnpj"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="12.345.678/0001-90"
                                    className="md:w-1/2"
                                    value={formatCNPJ(field.value || '')}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Endereço Completo"
                        invalid={Boolean(errors.address)}
                        errorMessage={errors.address?.message}
                        className="mb-4"
                    >
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Rua das Flores, 123, Sala 45"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <FormItem
                            label="Cidade"
                            invalid={Boolean(errors.city)}
                            errorMessage={errors.city?.message}
                        >
                            <Controller
                                name="city"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="São Paulo"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Estado"
                            invalid={Boolean(errors.state)}
                            errorMessage={errors.state?.message}
                        >
                            <Controller
                                name="state"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={brazilStates}
                                        {...field}
                                        placeholder="UF"
                                        value={brazilStates.filter(
                                            (option) => option.value === field.value
                                        )}
                                        onChange={(option) => field.onChange(option?.value)}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="CEP"
                            invalid={Boolean(errors.postcode)}
                            errorMessage={errors.postcode?.message}
                        >
                            <Controller
                                name="postcode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="01234-567"
                                        value={formatCEP(field.value || '')}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={field.onBlur}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <FormItem
                            label="Telefone Geral/WhatsApp"
                            invalid={Boolean(errors.officePhone)}
                            errorMessage={errors.officePhone?.message}
                        >
                            <Controller
                                name="officePhone"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="(11) 3333-4444"
                                        value={formatPhoneNumber(field.value || '')}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        onBlur={field.onBlur}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="E-mail Institucional"
                            invalid={Boolean(errors.officeEmail)}
                            errorMessage={errors.officeEmail?.message}
                        >
                            <Controller
                                name="officeEmail"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        type="email"
                                        placeholder="contato@escritorio.com.br"
                                        value={value}
                                        onChange={(e) => onChange(validateEmail(e.target.value))}
                                        onBlur={(e) => onChange(validateEmail(e.target.value))}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <FormItem
                            label="Site (opcional)"
                            invalid={Boolean(errors.website)}
                            errorMessage={errors.website?.message}
                        >
                            <Controller
                                name="website"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        type="url"
                                        placeholder="https://www.escritorio.com.br"
                                        value={value}
                                        onChange={(e) => onChange(validateWebsite(e.target.value))}
                                        onBlur={(e) => onChange(validateWebsite(e.target.value))}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Redes Sociais (opcional)"
                            invalid={Boolean(errors.socialMedia)}
                            errorMessage={errors.socialMedia?.message}
                        >
                            <Controller
                                name="socialMedia"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="@escritorioadvocacia"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                </div>

                {/* 3. ACEITE DOS TERMOS */}
                <div className="mb-8">
                    <h4 className="mb-6 text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Termos de Uso e Política de Privacidade
                    </h4>
                    
                    <FormItem
                        invalid={Boolean(errors.acceptTerms)}
                        errorMessage={errors.acceptTerms?.message}
                    >
                        <Controller
                            name="acceptTerms"
                            control={control}
                            rules={{ required: 'Você deve aceitar os termos de uso para continuar' }}
                            render={({ field }) => (
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        checked={field.value || false}
                                        onChange={(checked) => field.onChange(checked)}
                                    />
                                    <div className="text-sm">
                                        <span className="text-gray-700">
                                            Eu li e concordo com os{' '}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="plain"
                                            size="sm"
                                            className="!p-0 !h-auto text-blue-600 hover:text-blue-800 underline"
                                            onClick={() => setTermsModalOpen(true)}
                                        >
                                            Termos de Uso e Política de Privacidade
                                        </Button>
                                        <span className="text-red-500 ml-1">*</span>
                                    </div>
                                </div>
                            )}
                        />
                    </FormItem>
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                    >
                        Salvar
                    </Button>
                </div>
            </Form>

            {/* Modal dos Termos */}
            <Dialog
                isOpen={termsModalOpen}
                title="Termos de Uso e Política de Privacidade"
                width={800}
                onClose={() => setTermsModalOpen(false)}
            >
                <div className="max-h-96 overflow-y-auto mb-6">
                    <div className="prose prose-sm">
                        <h5>TERMOS DE USO</h5>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        
                        <h5 className="mt-4">POLÍTICA DE PRIVACIDADE</h5>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                            sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        
                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>
                        
                        <p>
                            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                            sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-end gap-3">
                    <Button
                        variant="plain"
                        onClick={() => handleTermsAccept(false)}
                    >
                        Não Concordo
                    </Button>
                    <Button
                        variant="solid"
                        onClick={() => handleTermsAccept(true)}
                    >
                        Concordo
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default SettingsProfile
