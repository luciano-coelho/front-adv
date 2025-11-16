import Card from '@/components/ui/Card'
import Upload from '@/components/ui/Upload'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { HiCloudUpload } from 'react-icons/hi'

const ContractSection = ({ control, errors }) => {
    const beforeUpload = (file) => {
        const isPDF = file.type === 'application/pdf'
        if (!isPDF) {
            alert('Você só pode fazer upload de arquivos PDF!')
            return false
        }
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt10M) {
            alert('O arquivo deve ter menos de 10MB!')
            return false
        }
        return true
    }

    return (
        <Card>
            <h4 className="mb-3">Documentos Relevantes</h4>
            
            <FormItem
                label=""
                invalid={Boolean(errors.contractFile)}
                errorMessage={errors.contractFile?.message}
            >
                <Controller
                    name="contractFile"
                    control={control}
                    render={({ field }) => (
                        <Upload
                            className="min-h-fit"
                            accept=".pdf"
                            beforeUpload={beforeUpload}
                            showList={true}
                            onChange={(files) => field.onChange(files)}
                        >
                            <div className="py-8 px-4 text-center flex flex-col items-center justify-center">
                                <div className="text-4xl mb-4 flex justify-center text-gray-400">
                                    <HiCloudUpload />
                                </div>
                                <p className="font-semibold mb-2">
                                    <span className="text-gray-800 dark:text-white">
                                        Clique para fazer upload
                                    </span>
                                    <span className="text-gray-500"> ou arraste e solte</span>
                                </p>
                                <p className="opacity-60 dark:text-white text-sm text-center">
                                    Ex: Contrato Honorário, CNH etc.
                                </p>
                            </div>
                        </Upload>
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default ContractSection