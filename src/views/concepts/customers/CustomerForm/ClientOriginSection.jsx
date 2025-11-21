import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'

const clientOriginOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'site', label: 'Site' },
    { value: 'google', label: 'Google' },
    { value: 'indicacao', label: 'Indicação' },
    { value: 'convenio', label: 'Convênio' },
    { value: 'parceria', label: 'Parceria' },
]

const ClientOriginSection = ({ control, errors, viewMode = false }) => {
    return (
        <Card>
            <h4 className="mb-4">Origem do Cliente</h4>
            <FormItem
                label="Como nos conheceu"
                invalid={Boolean(errors.clientOrigin)}
                errorMessage={errors.clientOrigin?.message}
                className="mb-4"
            >
                <Controller
                    name="clientOrigin"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={clientOriginOptions}
                            {...field}
                            placeholder="Selecione a origem"
                            value={clientOriginOptions.find(option => option.value === field.value)}
                            isDisabled={viewMode}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default ClientOriginSection