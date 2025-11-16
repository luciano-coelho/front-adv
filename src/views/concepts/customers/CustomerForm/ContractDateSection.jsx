import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'

const ContractDateSection = ({ control, errors }) => {
    return (
        <Card>
            <h4 className="mb-6">Data de Assinatura do Contrato</h4>
            
            <FormItem
                label="Data de Assinatura"
                invalid={Boolean(errors.contractSignDate)}
                errorMessage={errors.contractSignDate?.message}
            >
                <Controller
                    name="contractSignDate"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="date"
                            autoComplete="off"
                            placeholder="Data de assinatura"
                            {...field}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default ContractDateSection