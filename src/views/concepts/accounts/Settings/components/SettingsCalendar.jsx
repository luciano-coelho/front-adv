import { useState } from 'react'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const SettingsCalendar = () => {
    const [iframeCode, setIframeCode] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showCurrentUrl, setShowCurrentUrl] = useState(false)
    const [currentUrl, setCurrentUrl] = useState(
        localStorage.getItem('googleCalendarUrl') || ''
    )

    const extractUrlFromIframe = (iframeCode) => {
        const urlMatch = iframeCode.match(/src="([^"]*)"/)
        return urlMatch ? urlMatch[1] : ''
    }

    const applySystemStyling = (url) => {
        if (!url) return url
        
        // Remove parâmetros de cor existentes
        let cleanUrl = url.replace(/[&?](bgcolor|color|mode|showTitle|showNav|showDate|showPrint|showTabs|showCalendars|showTz|hl|wkst)=[^&]*/g, '')
        
        // Adiciona parâmetros para aparência completamente neutra
        const styleParams = [
            'bgcolor=%23FFFFFF',      // Fundo completamente branco
            'color=%23000000',        // Texto preto para contraste
            'mode=WEEK',              // Modo semana por padrão
            'showTitle=0',            // Oculta título do calendário
            'showNav=1',              // Mantém navegação
            'showDate=1',             // Mantém data
            'showPrint=0',            // Oculta botão imprimir
            'showTabs=0',             // Oculta abas para remover cores
            'showCalendars=0',        // Oculta lista de calendários
            'showTz=0',               // Oculta timezone
            'hl=pt_BR',               // Idioma português
            'wkst=1'                  // Semana começa na segunda
        ].join('&')
        
        // Adiciona os parâmetros
        const separator = cleanUrl.includes('?') ? '&' : '?'
        return `${cleanUrl}${separator}${styleParams}`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        try {
            const extractedUrl = extractUrlFromIframe(iframeCode)
            if (extractedUrl) {
                const styledUrl = applySystemStyling(extractedUrl)
                localStorage.setItem('googleCalendarUrl', styledUrl)
                setCurrentUrl(styledUrl)
                setIframeCode('')
                
                toast.push(
                    <Notification title="Agenda configurada com sucesso!" type="success" />,
                    { placement: 'top-center' }
                )
            } else {
                toast.push(
                    <Notification title="Código iframe inválido" type="danger" />,
                    { placement: 'top-center' }
                )
            }
        } catch {
            toast.push(
                <Notification title="Erro ao configurar agenda" type="danger" />,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClear = () => {
        localStorage.removeItem('googleCalendarUrl')
        setCurrentUrl('')
        setIframeCode('')
        setShowCurrentUrl(false)
        toast.push(
            <Notification title="Configuração de agenda removida" type="success" />,
            { placement: 'top-center' }
        )
    }

    const handleShowCurrentUrl = () => {
        setShowCurrentUrl(!showCurrentUrl)
    }

    return (
        <div>
            <div className="mb-8">
                <h4>Configuração da agenda</h4>
                <p>
                    Configure sua agenda do Google Calendar para exibição personalizada no sistema.
                </p>
            </div>

            {/* Status atual */}
            {currentUrl && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h6 className="text-green-800 dark:text-green-200 mb-2">✓ Agenda configurada</h6>
                    <p className="text-sm text-green-600 dark:text-green-300 mb-3">
                        Sua agenda está configurada e sendo exibida na página de calendário.
                    </p>
                    
                    <div className="flex gap-2 mb-3">
                        <Button 
                            size="sm" 
                            variant="default"
                            onClick={handleShowCurrentUrl}
                        >
                            {showCurrentUrl ? 'Ocultar URL' : 'Visualizar agenda configurada'}
                        </Button>
                        <Button 
                            size="sm" 
                            variant="plain"
                            customColorClass={() => 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'}
                            onClick={handleClear}
                        >
                            Remover configuração
                        </Button>
                    </div>

                    {showCurrentUrl && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                            <h6 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">URL da Agenda Configurada:</h6>
                            <a 
                                href={currentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 break-all font-mono bg-white dark:bg-gray-900 p-2 rounded border block cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                                title="Clique para abrir a agenda em uma nova aba"
                            >
                                {currentUrl}
                            </a>
                        </div>
                    )}
                </div>
            )}

            <Form onSubmit={handleSubmit}>
                <FormItem
                    label="Código iframe do Google Calendar"
                    className="mb-4"
                >
                    <textarea
                        required
                        value={iframeCode}
                        placeholder='Cole aqui o código iframe do Google Calendar (ex: <iframe src="https://calendar.google.com/calendar/embed?src=..."></iframe>)'
                        className="text-xs break-all font-mono bg-white dark:bg-gray-900 p-2 rounded border block w-full h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        onChange={(e) => setIframeCode(e.target.value)}
                    />
                </FormItem>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <h6 className="font-medium mb-2">Como obter o código iframe:</h6>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Acesse <strong>Google Calendar</strong> (calendar.google.com)</li>
                        <li>Clique em <strong>Configurações</strong> (ícone de engrenagem)</li>
                        <li>Selecione <strong>Configurações</strong> no menu</li>
                        <li>Escolha a <strong>agenda desejada</strong> na lista lateral</li>
                        <li>Role até a seção &quot;Integrar agenda&quot;</li>
                        <li>Copie o <strong>código iframe público</strong></li>
                    </ol>
                </div>
                
                <div className="flex justify-end gap-3">
                    <Button 
                        variant="plain" 
                        type="button"
                        onClick={() => setIframeCode('')}
                    >
                        Limpar
                    </Button>
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                        disabled={!iframeCode.trim()}
                    >
                        Aplicar Configuração
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default SettingsCalendar