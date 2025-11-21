import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import Checkbox from '@/components/ui/Checkbox'
import { useEffect } from 'react'

const paymentMethodOptions = [
    { value: 'boleto', label: 'Boleto' },
    { value: 'cartao', label: 'Cartão' },
    { value: 'pix', label: 'PIX' },
    { value: 'especie', label: 'Em Espécie' },
]

const BillingSection = ({ control, errors, watch, setValue, viewMode }) => {
    const billingSameAsClient = watch('billingSameAsClient')
    
    // Watch dos dados do cliente para auto-preenchimento
    const clientDocument = watch('document')
    const clientEmail = watch('email')

    // Auto-preenchimento quando billingSameAsClient muda
    useEffect(() => {
        if (billingSameAsClient && setValue) {
            // Preencher automaticamente os campos de faturamento com dados do cliente
            setValue('billingDocument', clientDocument || '', { shouldValidate: true })
            setValue('billingEmail', clientEmail || '', { shouldValidate: true })
        }
    }, [billingSameAsClient, clientDocument, clientEmail, setValue])

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

    const formatBillingDocument = (value) => {
        if (!value) return ''
        const numbers = value.replace(/\D/g, '')
        
        // Se tem 11 dígitos ou menos, formato CPF
        if (numbers.length <= 11) {
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

    return (
        <Card className="min-h-fit">
            <h4 className="mb-2">Dados de Faturamento</h4>
            
            {/* Checkbox - Dados iguais ao cliente */}
            <FormItem>
                <Controller
                    name="billingSameAsClient"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            {...field}
                            checked={field.value}
                            onChange={(checked) => field.onChange(checked)}
                        >
                            Utilizar dados do Cliente
                        </Checkbox>
                    )}
                />
            </FormItem>

            {/* Campos sempre visíveis - mas com readonly quando flag = true */}
            <div className="space-y-2 mt-2">
                <FormItem
                    label="CPF/CNPJ para Faturamento"
                    invalid={Boolean(errors.billingDocument)}
                    errorMessage={errors.billingDocument?.message}
                >
                    <Controller
                        name="billingDocument"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                value={formatBillingDocument(field.value || '')}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                readOnly={billingSameAsClient}
                                disabled={billingSameAsClient || viewMode}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="E-mail para Cobrança"
                    invalid={Boolean(errors.billingEmail)}
                    errorMessage={errors.billingEmail?.message}
                >
                    <Controller
                        name="billingEmail"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                autoComplete="off"
                                placeholder="email@cobranca.com"
                                value={validateEmail(field.value || '')}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                readOnly={billingSameAsClient}
                                disabled={billingSameAsClient || viewMode}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Forma de Pagamento - sempre visível e editável */}
            <div className="space-y-2 mt-2 mb-2">
                <FormItem
                    label="Forma de Pagamento"
                    invalid={Boolean(errors.paymentMethod)}
                    errorMessage={errors.paymentMethod?.message}
                >
                    <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={paymentMethodOptions}
                                {...field}
                                placeholder="Selecione a forma de pagamento"
                                value={paymentMethodOptions.find(option => option.value === field.value)}
                                isDisabled={viewMode}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default BillingSection