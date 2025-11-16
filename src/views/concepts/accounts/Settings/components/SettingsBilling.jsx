import { useState } from 'react'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CreditCardDialog from '@/components/view/CreditCardDialog'
import BillingHistory from './BillingHistory'
import { apiGetSettingsBilling } from '@/services/AccontsService'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import sleep from '@/utils/sleep'
import { TbPlus } from 'react-icons/tb'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import { PiLightningFill } from 'react-icons/pi'
import { NumericFormat } from 'react-number-format'

const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
]

const SettingsBilling = () => {
    const navigate = useNavigate()

    const [selectedCard, setSelectedCard] = useState({
        type: '',
        dialogOpen: false,
        cardInfo: {},
    })

    const {
        data = {
            currentPlan: {
                plan: '',
                status: '',
                billingCycle: '',
                nextPaymentDate: null,
                amount: null,
            },
            paymentMethods: [],
            transactionHistory: [],
        },
    } = useSWR('/api/settings/billing/', () => apiGetSettingsBilling(), {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    })

    const handleEditCreditCard = (card) => {
        setSelectedCard({
            type: 'EDIT',
            dialogOpen: true,
            cardInfo: card,
        })
    }

    const handleCreditCardDialogClose = () => {
        setSelectedCard({
            type: '',
            dialogOpen: false,
            cardInfo: {},
        })
    }

    const handleEditCreditCardSubmit = async () => {
        // Log para capturar dados do formulário de cartão de crédito (edição)
        console.log('=== DADOS EDIÇÃO CARTÃO DE CRÉDITO ===')
        console.log('Dados da edição:', selectedCard.cardInfo)
        console.log('JSON formatado:', JSON.stringify(selectedCard.cardInfo, null, 2))
        console.log('=====================================')
        
        await sleep(500)
        handleCreditCardDialogClose()
        toast.push(
            <Notification type="success">Cartão de crédito atualizado!</Notification>,
            { placement: 'top-center' },
        )
    }

    const handleAddCreditCardSubmit = async (values) => {
        // Log para capturar dados do formulário de cartão de crédito (novo)
        console.log('=== DADOS NOVO CARTÃO DE CRÉDITO ===')
        console.log('Dados do novo cartão:', values)
        console.log('JSON formatado:', JSON.stringify(values, null, 2))
        console.log('===================================')
        
        console.log('Submitted values', values)
        await sleep(500)
        handleCreditCardDialogClose()
        toast.push(
            <Notification type="success">Cartão de crédito adicionado!</Notification>,
            { placement: 'top-center' },
        )
    }

    const handleChangePlan = () => {
        navigate('/concepts/account/pricing?subcription=basic&cycle=monthly')
    }

    return (
        <div>
            <h4 className="mb-4">Plano</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <Avatar
                                className="bg-emerald-500"
                                shape="circle"
                                icon={<PiLightningFill />}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h6 className="font-bold">
                                    {data.currentPlan.plan}
                                </h6>
                                <Tag className="bg-success-subtle text-success rounded-md border-0">
                                    <span className="capitalize">
                                        {data.currentPlan.status === 'active' ? 'Ativo' : data.currentPlan.status}
                                    </span>
                                </Tag>
                            </div>
                            <div className="font-semibold">
                                <span>
                                    Cobrança {data.currentPlan.billingCycle === 'monthly' ? 'mensal' : data.currentPlan.billingCycle === 'yearly' ? 'anual' : data.currentPlan.billingCycle}
                                </span>
                                <span> | </span>
                                <span>
                                    Próximo pagamento em{' '}
                                    {dayjs
                                        .unix(
                                            data.currentPlan.nextPaymentDate ||
                                                0,
                                        )
                                        .format('DD/MM/YYYY')}
                                </span>
                                <span>
                                    <span className="mx-1">por</span>
                                    <NumericFormat
                                        className="font-bold heading-text"
                                        displayType="text"
                                        value={(
                                            Math.round(
                                                (data.currentPlan.amount || 0) *
                                                    100,
                                            ) / 100
                                        ).toFixed(2)}
                                        prefix={'R$ '}
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <Button
                            size="sm"
                            variant="solid"
                            onClick={handleChangePlan}
                        >
                            Alterar plano
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h5>Forma de pagamento</h5>
                <div>
                    {data.paymentMethods?.map((card, index) => (
                        <div
                            key={card.cardId}
                            className={classNames(
                                'flex items-center justify-between p-4',
                                !isLastChild(data.paymentMethods, index) &&
                                    'border-b border-gray-200 dark:border-gray-600',
                            )}
                        >
                            <div className="flex items-center">
                                {card.cardType === 'VISA' && (
                                    <img
                                        src="/img/others/img-8.png"
                                        alt="visa"
                                    />
                                )}
                                {card.cardType === 'MASTER' && (
                                    <img
                                        src="/img/others/img-9.png"
                                        alt="master"
                                    />
                                )}
                                <div className="ml-3 rtl:mr-3">
                                    <div className="flex items-center">
                                        <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                            {card.cardHolderName} ••••{' '}
                                            {card.last4Number}
                                        </div>
                                        {card.primary && (
                                            <Tag className="bg-primary-subtle text-primary rounded-md border-0 mx-2">
                                                <span className="capitalize">
                                                    {' '}
                                                    Principal{' '}
                                                </span>
                                            </Tag>
                                        )}
                                    </div>
                                    <span>
                                        Expira em{' '}
                                        {months[parseInt(card.expMonth) - 1]} 20
                                        {card.expYear}
                                    </span>
                                </div>
                            </div>
                            <div className="flex">
                                <Button
                                    size="sm"
                                    type="button"
                                    onClick={() => handleEditCreditCard(card)}
                                >
                                    Editar
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="plain"
                        icon={<TbPlus />}
                        onClick={() => {
                            setSelectedCard({
                                type: 'NEW',
                                dialogOpen: true,
                                cardInfo: {},
                            })
                        }}
                    >
                        Adicionar forma de pagamento
                    </Button>
                </div>
            </div>
            <div className="mt-8">
                <h5>Histórico de transações</h5>
                <BillingHistory
                    className="mt-4"
                    data={data.transactionHistory}
                />
            </div>
            <CreditCardDialog
                title={
                    selectedCard.type === 'NEW'
                        ? 'Adicionar cartão de crédito'
                        : 'Editar cartão de crédito'
                }
                defaultValues={selectedCard.cardInfo}
                dialogOpen={selectedCard.dialogOpen}
                onDialogClose={handleCreditCardDialogClose}
                onSubmit={
                    selectedCard.type === 'NEW'
                        ? (values) => handleAddCreditCardSubmit(values)
                        : handleEditCreditCardSubmit
                }
            />
        </div>
    )
}

export default SettingsBilling
