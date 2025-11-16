import Card from '@/components/ui/Card'
import Switcher from '@/components/ui/Switcher'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'

const AccountSection = ({ control }) => {
    return (
        <Card>
            <h4>Conta</h4>
            <div className="mt-6">
                <FormItem>
                    <Controller
                        name="banAccount"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center justify-between gap-8">
                                <div>
                                    <h6>Banido</h6>
                                    <p>Desabilitar esta conta</p>
                                </div>
                                <Switcher
                                    checked={field.value}
                                    onChange={(checked) => {
                                        field.onChange(checked)
                                    }}
                                />
                            </div>
                        )}
                    />
                </FormItem>
                <FormItem className="mb-0">
                    <Controller
                        name="accountVerified"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center justify-between gap-8">
                                <div>
                                    <h6>Conta Verificada</h6>
                                    <p>
                                        Desabilitar envia uma solicitação de verificação
                                        para o cliente.
                                    </p>
                                </div>
                                <Switcher
                                    checked={field.value}
                                    onChange={(checked) => {
                                        field.onChange(checked)
                                    }}
                                />
                            </div>
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default AccountSection
