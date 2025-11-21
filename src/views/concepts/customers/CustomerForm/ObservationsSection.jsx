import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { useState } from 'react'

const ObservationsSection = ({ control, errors, viewMode = false }) => {
    const [observationsLength, setObservationsLength] = useState(0)
    
    return (
        <Card>
            <h4 className="mb-4">Observações</h4>
            
            <FormItem
                label="Observações Gerais"
                invalid={Boolean(errors.observations)}
                errorMessage={errors.observations?.message}
                className="mb-2"
            >
                <Controller
                    name="observations"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            rows={4}
                            maxLength={150}
                            autoComplete="off"
                            placeholder="Digite observações gerais sobre o cliente (máximo 150 caracteres)"
                            disabled={viewMode}
                            {...field}
                            onChange={(e) => {
                                field.onChange(e)
                                setObservationsLength(e.target.value.length)
                            }}
                        />
                    )}
                />
            </FormItem>

            {/* Contador de caracteres */}
            <div className={`text-xs text-right mb-4 ${
                observationsLength > 130 ? 'text-red-500' : 
                observationsLength > 100 ? 'text-yellow-600' : 'text-gray-500'
            }`}>
                {observationsLength}/150 caracteres
            </div>
        </Card>
    )
}

export default ObservationsSection