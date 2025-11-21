import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'

const clientStatusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'em-atendimento', label: 'Em Atendimento' },
    { value: 'prospectado', label: 'Prospectado' },
]

const TagsSection = ({ control, errors, viewMode = false }) => {
    return (
        <Card>
            <h4 className="mb-4">Situação do Cliente</h4>
            <FormItem
                label="Status Atual"
                invalid={Boolean(errors.clientStatus)}
                errorMessage={errors.clientStatus?.message}
                className="mb-4"
            >
                <Controller
                    name="clientStatus"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={clientStatusOptions}
                            {...field}
                            placeholder="Selecione a situação"
                            value={clientStatusOptions.find(option => option.value === field.value)}
                            isDisabled={viewMode}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default TagsSection