import { useState } from 'react'
import { useLocation } from 'react-router'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '../CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import sleep from '@/utils/sleep'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { apiUpdateCustomerMock } from '@/services/CustomersService'
import useCustomerList from '../CustomerList/hooks/useCustomerList'

const CustomerEdit = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { mutate } = useCustomerList()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values) => {
        setIsSubmiting(true)
        // Monta JSON customizado para backend
        const formatDate = (date) => {
            if (!date) return null;
            const d = date instanceof Date ? date : new Date(date);
            if (isNaN(d.getTime())) return null;
            const pad = (n) => n.toString().padStart(2, '0');
            return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
        };

        const onlyNumbers = (str) => str ? str.replace(/\D/g, '') : '';

        const customerJson = {
            ...values,
            birthDate: formatDate(values.birthDate),
            document: onlyNumbers(values.document),
            phoneNumber: onlyNumbers(values.phoneNumber),
            postcode: onlyNumbers(values.postcode),
            clientFile: values.contractFile ?? null,
        };
        delete customerJson.contractFile;
        // Remove campos ocultos
        delete customerJson.paymentMethod;
        delete customerJson.billingDocument;
        delete customerJson.billingEmail;
        delete customerJson.billingSameAsClient;

        console.log('JSON do cliente para backend:', JSON.stringify(customerJson, null, 2));
        await apiUpdateCustomerMock(values)
        await sleep(500)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">Cliente salvo com sucesso!</Notification>,
            { placement: 'top-center' },
        )
        mutate() // Atualiza a listagem local
        navigate('/concepts/customers/customer-list')
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Cliente descartado!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/customers/customer-list')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    // Se vier do editar, location.state.customer terá os dados
    const editCustomer = location.state?.customer
    return (
        <>
            <CustomerForm
                newCustomer={!editCustomer}
                defaultValues={editCustomer || {
                    firstName: '',
                    lastName: '',
                    email: '',
                    img: '',
                    phoneNumber: '',
                    dialCode: '',
                    country: '',
                    address: '',
                    city: '',
                    postcode: '',
                    tags: [],
                }}
                onFormSubmit={(values) => {
                    console.log('Form submit:', values)
                    handleFormSubmit(values)
                }}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDiscard}
                            >
                                Descartar
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                                id="customer-save-btn"
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                </Container>
            </CustomerForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Descartar alterações"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Tem certeza que deseja descartar? Esta ação não pode ser desfeita.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerEdit
