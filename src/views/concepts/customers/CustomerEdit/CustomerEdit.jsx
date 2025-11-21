import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetCustomer } from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import sleep from '@/utils/sleep'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft, TbEdit } from 'react-icons/tb'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import useSWR from 'swr'

const CustomerEdit = () => {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const isViewMode = searchParams.get('view') === 'true'
    
    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        [`/api/customers${id}`, { id: id }],
        // eslint-disable-next-line no-unused-vars
        ([_, params]) => apiGetCustomer(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [viewMode, setViewMode] = useState(isViewMode)

    const handleEdit = () => {
        setViewMode(false)
        // Não remove o parâmetro view da URL, apenas altera o estado interno
    }

    const handleFormSubmit = async (values) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(<Notification type="success">Alterações Salvas!</Notification>, {
            placement: 'top-center',
        })
        navigate('/concepts/customers/customer-list')
    }

    const getDefaultValues = () => {
        if (data) {
            // Converte dados do mock para o formato do form
            return {
                personType: data.personalInfo?.personType || 'fisica',
                firstName: data.name,
                document: data.personalInfo?.document || '',
                birthDate: data.personalInfo?.birthday ? new Date(data.personalInfo.birthday.split('/').reverse().join('-')) : undefined,
                email: data.email,
                phoneNumber: data.personalInfo?.phoneNumber || '',
                primaryContact: data.personalInfo?.primaryContact || 'email',
                internalResponsible: 'Dr. João Silva', // Default
                securityKeyword: data.personalInfo?.securityKeyword || '',
                state: data.personalInfo?.location?.split(', ')[1] || 'SP',
                city: data.personalInfo?.location?.split(', ')[0] || 'São Paulo',
                postcode: data.personalInfo?.postcode || '',
                neighborhood: data.personalInfo?.neighborhood || '',
                address: data.personalInfo?.address || '',
                number: data.personalInfo?.number || '',
                complement: data.personalInfo?.complement || '',
                billingSameAsClient: data.billing?.billingSameAsClient !== false,
                billingDocument: data.billing?.billingDocument || '',
                billingEmail: data.billing?.billingEmail || '',
                paymentMethod: data.billing?.paymentMethod || 'boleto',
                clientOrigin: 'site', // Default
                clientStatus: data.personalInfo?.clientStatus || 'ativo',
                contractSignDate: data.contract?.contractSignDate || '',
                observations: data.contract?.observations || '',
            }
        }

        return {}
    }

    const handleConfirmDelete = () => {
        setDeleteConfirmationOpen(true)
        toast.push(
            <Notification type="success">Cliente excluído!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/customers/customer-list')
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        history.back()
    }

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">Usuário não encontrado!</h3>
                </div>
            )}
            {!isLoading && data && (
                <>
                    <CustomerForm
                        defaultValues={getDefaultValues()}
                        newCustomer={false}
                        viewMode={viewMode}
                        onFormSubmit={handleFormSubmit}
                    >
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Voltar
                                </Button>
                                <div className="flex items-center gap-3">
                                    <Button
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        icon={<TbTrash />}
                                        disabled={viewMode}
                                        onClick={handleDelete}
                                    >
                                        Excluir
                                    </Button>
                                    <Button
                                        variant="twoTone"
                                        icon={<TbEdit />}
                                        disabled={!viewMode} // Desabilitado quando em modo edição
                                        onClick={handleEdit}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmiting}
                                        disabled={viewMode} // Desabilitado quando em modo visualização
                                    >
                                        Salvar
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </CustomerForm>
                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title="Remover cliente"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>
                            Tem certeza de que deseja remover este cliente? Esta
                            ação não pode ser desfeita.{' '}
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CustomerEdit
