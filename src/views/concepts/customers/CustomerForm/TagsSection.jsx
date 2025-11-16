import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'

const clientStatusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'prospectado', label: 'Prospectado' },
]

const TagsSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">Situação do Cliente</h4>
            <FormItem
                label="Status Atual"
                invalid={Boolean(errors.clientStatus)}
                errorMessage={errors.clientStatus?.message}
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
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default TagsSection
