import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'

const ContractDateSection = ({ control, errors, viewMode = false }) => {
    return (
        <Card>
            <h4 className="mb-4">Data de Assinatura do Contrato</h4>
            
            <FormItem
                label="Data de Assinatura"
                invalid={Boolean(errors.contractSignDate)}
                errorMessage={errors.contractSignDate?.message}
                className="mb-4"
            >
                <Controller
                    name="contractSignDate"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="date"
                            autoComplete="off"
                            placeholder="Data de assinatura"
                            disabled={viewMode}
                            {...field}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default ContractDateSection