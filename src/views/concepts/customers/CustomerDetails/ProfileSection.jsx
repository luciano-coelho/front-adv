import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import Tooltip from '@/components/ui/Tooltip'
import Tag from '@/components/ui/Tag'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import dayjs from 'dayjs'
import { HiPencil, HiOutlineTrash, HiMail, HiPhone, HiEye, HiEyeOff } from 'react-icons/hi'
import { useNavigate } from 'react-router'

const statusColor = {
    ativo: 'bg-emerald-500 text-white',
    inativo: 'bg-red-500 text-white',
    'em-atendimento': 'bg-orange-500 text-white',
    prospectado: 'bg-yellow-500 text-black',
}

const CustomerInfoField = ({ title, value, className = '' }) => {
    return (
        <div className={className}>
            <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
            <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
        </div>
    )
}

const SecurityKeywordField = ({ keyword }) => {
    const [showKeyword, setShowKeyword] = useState(false)
    
    return (
        <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Palavra Chave</span>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-900 dark:text-gray-100 font-semibold font-mono">
                    {showKeyword ? keyword : '••••••••'}
                </span>
                <Tooltip title={showKeyword ? 'Ocultar palavra chave' : 'Exibir palavra chave'}>
                    <button
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                        onClick={() => setShowKeyword(!showKeyword)}
                    >
                        {showKeyword ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
                    </button>
                </Tooltip>
            </div>
        </div>
    )
}

const ContactMethodField = ({ primaryContact }) => {
    const isPrimaryEmail = primaryContact === 'email'
    const isPrimaryWhatsApp = primaryContact === 'whatsapp'
    
    return (
        <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Contato Preferencial</span>
            <div className="flex items-center gap-3 mt-2">
                <Tooltip title={`E-mail${isPrimaryEmail ? ' (Principal)' : ''}`}>
                    <div className="flex items-center gap-2">
                        <HiMail className={`text-lg ${
                            isPrimaryEmail ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        {isPrimaryEmail && (
                            <span className="text-xs font-medium text-blue-600">Principal</span>
                        )}
                    </div>
                </Tooltip>
                <Tooltip title={`WhatsApp${isPrimaryWhatsApp ? ' (Principal)' : ''}`}>
                    <div className="flex items-center gap-2">
                        <HiPhone className={`text-lg ${
                            isPrimaryWhatsApp ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        {isPrimaryWhatsApp && (
                            <span className="text-xs font-medium text-green-600">Principal</span>
                        )}
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}

const ProfileSection = ({ data = {} }) => {
    const navigate = useNavigate()

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleDialogClose = () => {
        setDialogOpen(false)
    }

    const handleDialogOpen = () => {
        setDialogOpen(true)
    }

    const handleDelete = () => {
        setDialogOpen(false)
        navigate('/concepts/customers/customer-list')
        toast.push(
            <Notification title={'Excluído com Sucesso'} type="success">
                Cliente excluído com sucesso
            </Notification>,
        )
    }

    const handleSendMessage = () => {
        // Redireciona para WhatsApp ou abre cliente de e-mail baseado na preferência
        const primaryContact = data.personalInfo?.primaryContact
        const phone = data.personalInfo?.phoneNumber?.replace(/\D/g, '')
        
        if (primaryContact === 'whatsapp' && phone) {
            window.open(`https://wa.me/55${phone}`, '_blank')
        } else {
            window.location.href = `mailto:${data.email}`
        }
    }

    const handleEdit = () => {
        navigate('/concepts/customers/customer-create')
    }

    // Labels para status
    const statusLabels = {
        ativo: 'Ativo',
        inativo: 'Inativo',
        'em-atendimento': 'Em Atendimento', 
        prospectado: 'Prospectado'
    }

    // Labels para tipo de pessoa
    const personTypeLabel = data.personalInfo?.personType === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'

    return (
        <Card className="w-full">
            <div className="flex justify-end">
                <Tooltip title="Editar cliente">
                    <button
                        className="close-button button-press-feedback"
                        type="button"
                        onClick={handleEdit}
                    >
                        <HiPencil />
                    </button>
                </Tooltip>
            </div>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                {/* Cabeçalho com nome e status */}
                <div className="flex xl:flex-col items-start gap-4 mt-6">
                    <div className="w-full">
                        <h4 className="font-bold text-xl mb-2">{data.name}</h4>
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                data.personalInfo?.personType === 'fisica' 
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-orange-100 text-orange-700'
                            }`}>
                                {personTypeLabel}
                            </span>
                            <Tag className={statusColor[data.personalInfo?.clientStatus] || statusColor.ativo}>
                                <span>
                                    {statusLabels[data.personalInfo?.clientStatus] || 'Ativo'}
                                </span>
                            </Tag>
                        </div>
                    </div>
                </div>
                
                {/* Informações do cliente */}
                <div className="grid grid-cols-1 gap-y-6 mt-6">
                    <CustomerInfoField 
                        title="E-mail" 
                        value={data.email || 'N/A'} 
                    />
                    <CustomerInfoField
                        title="Telefone/WhatsApp"
                        value={data.personalInfo?.phoneNumber || 'N/A'}
                    />
                    <CustomerInfoField
                        title="CPF/CNPJ"
                        value={data.personalInfo?.document || 'N/A'}
                    />
                    {data.personalInfo?.personType === 'fisica' && (
                        <CustomerInfoField
                            title="Data de Nascimento"
                            value={data.personalInfo?.birthday || 'N/A'}
                        />
                    )}
                    <ContactMethodField 
                        primaryContact={data.personalInfo?.primaryContact}
                    />
                    <SecurityKeywordField 
                        keyword={data.personalInfo?.securityKeyword || 'N/A'}
                    />
                    <CustomerInfoField
                        title="Localização"
                        value={data.personalInfo?.location || 'N/A'}
                    />
                    <CustomerInfoField
                        title="Último Acesso"
                        value={dayjs
                            .unix(data.lastOnline || Math.floor(Date.now() / 1000))
                            .format('DD/MM/YYYY HH:mm')}
                    />
                </div>
                
                {/* Ações */}
                <div className="flex flex-col gap-4 mt-8">
                    <Button block variant="solid" onClick={handleSendMessage}>
                        {data.personalInfo?.primaryContact === 'whatsapp' ? 'Enviar WhatsApp' : 'Enviar E-mail'}
                    </Button>
                    <Button
                        block
                        customColorClass={() =>
                            'text-error hover:border-error hover:ring-1 ring-error hover:text-error'
                        }
                        icon={<HiOutlineTrash />}
                        onClick={handleDialogOpen}
                    >
                        Excluir Cliente
                    </Button>
                </div>
                <ConfirmDialog
                    isOpen={dialogOpen}
                    type="danger"
                    title="Excluir cliente"
                    onClose={handleDialogClose}
                    onRequestClose={handleDialogClose}
                    onCancel={handleDialogClose}
                    onConfirm={handleDelete}
                >
                    <p>
                        Tem certeza de que deseja excluir este cliente? Todos os
                        registros relacionados a este cliente também serão excluídos.
                        Esta ação não pode ser desfeita.
                    </p>
                </ConfirmDialog>
            </div>
        </Card>
    )
}

export default ProfileSection
