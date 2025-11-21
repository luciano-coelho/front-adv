import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'

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

const AddressSection = ({ control, errors, viewMode }) => {
    const formatCEP = (value) => {
        if (!value) return ''
        const numbers = value.replace(/\D/g, '')
        
        if (numbers.length <= 5) {
            return numbers
        } else {
            return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
        }
    }

    const validateCity = (value) => {
        if (!value) return ''
        // Remove números e caracteres especiais, mantém apenas letras e espaços
        return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
    }

    return (
        <Card>
            <h4 className="mb-6">Endereço</h4>
            
            {/* Linha 1: Estado e Cidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
                                placeholder="Selecione o Estado"
                                value={brazilStates.find(option => option.value === field.value)}
                                isDisabled={viewMode}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                </FormItem>
                
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
                                autoComplete="off"
                                placeholder="Nome da cidade"
                                value={validateCity(field.value || '')}
                                disabled={viewMode}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Linha 2: CEP e Bairro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
                                autoComplete="off"
                                placeholder="12345-678"
                                value={formatCEP(field.value || '')}
                                disabled={viewMode}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
                
                <FormItem
                    label="Bairro"
                    invalid={Boolean(errors.neighborhood)}
                    errorMessage={errors.neighborhood?.message}
                >
                    <Controller
                        name="neighborhood"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Nome do bairro"
                                {...field}
                                disabled={viewMode}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Linha 3: Logradouro, Número e Complemento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="md:col-span-2">
                    <FormItem
                        label="Logradouro"
                        invalid={Boolean(errors.address)}
                        errorMessage={errors.address?.message}
                    >
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Rua, Avenida, Travessa..."
                                    {...field}
                                    disabled={viewMode}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                
                <FormItem
                    label="Número"
                    invalid={Boolean(errors.number)}
                    errorMessage={errors.number?.message}
                >
                    <Controller
                        name="number"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Nº"
                                {...field}
                                disabled={viewMode}
                            />
                        )}
                    />
                </FormItem>
            </div>

            {/* Linha 4: Complemento (campo único, mais largo) */}
            <div className="mt-4">
                <FormItem
                    label="Complemento"
                    invalid={Boolean(errors.complement)}
                    errorMessage={errors.complement?.message}
                >
                    <Controller
                        name="complement"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Apartamento, Bloco, Casa, etc. (opcional)"
                                {...field}
                                disabled={viewMode}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default AddressSection
