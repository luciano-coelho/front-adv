import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { DatePicker } from '@/components/ui/DatePicker'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'

const OverviewSection = ({ control, errors, watch }) => {
    // Watch para reagir às mudanças do tipo de pessoa
    const personType = watch('personType')

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
        if (numbers.length <= 3) return numbers
        if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
        if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
        return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
    }

    const formatCNPJ = (value) => {
        if (!value) return ''
        const numbers = value.replace(/\D/g, '')
        if (numbers.length <= 2) return numbers
        if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
        if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
        if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
    }

    const formatDocument = (value) => {
        if (personType === 'fisica') {
            return formatCPF(value)
        } else {
            return formatCNPJ(value)
        }
    }

    const validateEmail = (value) => {
        if (!value) return ''
        // Remove espaços e caracteres inválidos para email
        return value.replace(/[^a-zA-Z0-9@._-]/g, '').toLowerCase()
    }

    const validateName = (value) => {
        if (!value) return ''
        // Remove números e caracteres especiais, mantém apenas letras e espaços
        return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
    }

    return (
        <Card>
            <h4 className="mb-6">Dados do Cliente</h4>
            
            {/* Linha 1: Tipo de Pessoa */}
            <FormItem
                label="Tipo de Pessoa"
                invalid={Boolean(errors.personType)}
                errorMessage={errors.personType?.message}
                className="mb-6"
            >
                <Controller
                    name="personType"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={[
                                { value: 'fisica', label: 'Pessoa Física' },
                                { value: 'juridica', label: 'Pessoa Jurídica' }
                            ]}
                            {...field}
                            placeholder="Selecione o tipo"
                            value={[
                                { value: 'fisica', label: 'Pessoa Física' },
                                { value: 'juridica', label: 'Pessoa Jurídica' }
                            ].find(option => option.value === field.value)}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>

            {/* Linha 2: Nome/Razão Social e CPF/CNPJ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <FormItem
                    label={personType === 'fisica' ? 'Nome Completo' : 'Razão Social'}
                    invalid={Boolean(errors.firstName)}
                    errorMessage={errors.firstName?.message}
                >
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder={personType === 'fisica' ? 'Nome completo do cliente' : 'Razão Social da empresa'}
                                value={validateName(field.value || '')}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
                
                <FormItem
                    label={personType === 'fisica' ? 'CPF' : 'CNPJ'}
                    invalid={Boolean(errors.document)}
                    errorMessage={errors.document?.message}
                >
                    <Controller
                        name="document"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder={personType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                                value={formatDocument(field.value || '')}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Linha 3: Data de Nascimento (só Pessoa Física) e E-mail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {personType === 'fisica' ? (
                    <FormItem
                        label="Data de Nascimento"
                        invalid={Boolean(errors.birthDate)}
                        errorMessage={errors.birthDate?.message}
                    >
                        <Controller
                            name="birthDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    inputtable
                                    placeholder="Selecione a data de nascimento"
                                    inputFormat="dd/MM/yyyy"
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                />
                            )}
                        />
                    </FormItem>
                ) : (
                    <div></div>
                )}
                
                <FormItem
                    label="E-mail"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                autoComplete="off"
                                placeholder={personType === 'fisica' ? 'E-mail do cliente' : 'E-mail da empresa'}
                                value={validateEmail(field.value || '')}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Linha 4: Celular/WhatsApp e Contato Principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <FormItem
                    label="Celular/WhatsApp"
                    invalid={Boolean(errors.phoneNumber)}
                    errorMessage={errors.phoneNumber?.message}
                >
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="(11) 99999-9999"
                                value={formatPhoneNumber(field.value || '')}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Contato Principal"
                    invalid={Boolean(errors.primaryContact)}
                    errorMessage={errors.primaryContact?.message}
                >
                    <Controller
                        name="primaryContact"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={[
                                    { value: 'email', label: 'E-mail' },
                                    { value: 'whatsapp', label: 'WhatsApp' }
                                ]}
                                {...field}
                                placeholder="Selecione o contato principal"
                                value={[
                                    { value: 'email', label: 'E-mail' },
                                    { value: 'whatsapp', label: 'WhatsApp' }
                                ].find(option => option.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Linha 5: Responsável Interno e Palavra Chave de Segurança */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem
                    label="Responsável Interno"
                    invalid={Boolean(errors.internalResponsible)}
                    errorMessage={errors.internalResponsible?.message}
                >
                    <Controller
                        name="internalResponsible"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={[
                                    { value: 'Advogado Principal', label: 'Advogado Principal' }
                                    // Futuramente: outras opções serão adicionadas
                                ]}
                                {...field}
                                placeholder="Selecione o responsável"
                                value={[
                                    { value: 'Advogado Principal', label: 'Advogado Principal' }
                                ].find(option => option.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Palavra Chave de Segurança"
                    invalid={Boolean(errors.securityKeyword)}
                    errorMessage={errors.securityKeyword?.message}
                >
                    <Controller
                        name="securityKeyword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Palavra para validação de contatos"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection