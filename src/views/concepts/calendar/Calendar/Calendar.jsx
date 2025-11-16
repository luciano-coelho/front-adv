import { useState, useEffect } from 'react'
import { HiPlus } from 'react-icons/hi'
import Container from '@/components/shared/Container'
import { Button } from '@/components/ui'

const Calendar = () => {
    const [iframeUrl, setIframeUrl] = useState(() => {
        return localStorage.getItem('googleCalendarUrl') || 
               'https://calendar.google.com/calendar/embed?src=pt-br.brazilian%23holiday%40group.v.calendar.google.com&ctz=America%2FSao_Paulo&bgcolor=%23FFFFFF&color=%23000000&mode=WEEK&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&hl=pt-BR&wkst=1&lang=pt-BR'
    })

    useEffect(() => {
        const handleStorageChange = () => {
            const newUrl = localStorage.getItem('googleCalendarUrl')
            if (newUrl !== iframeUrl) {
                setIframeUrl(newUrl || 'https://calendar.google.com/calendar/embed?src=pt-br.brazilian%23holiday%40group.v.calendar.google.com&ctz=America%2FSao_Paulo&bgcolor=%23FFFFFF&color=%23000000&mode=WEEK&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&hl=pt-BR&wkst=1&lang=pt-BR')
            }
        }

        window.addEventListener('storage', handleStorageChange)
        
        // Também verifica mudanças no mesmo tab
        const interval = setInterval(() => {
            const currentUrl = localStorage.getItem('googleCalendarUrl')
            if (currentUrl !== iframeUrl) {
                setIframeUrl(currentUrl || 'https://calendar.google.com/calendar/embed?src=pt-br.brazilian%23holiday%40group.v.calendar.google.com&ctz=America%2FSao_Paulo&bgcolor=%23FFFFFF&color=%23000000&mode=WEEK&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&hl=pt-BR&wkst=1&lang=pt-BR')
            }
        }, 1000)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            clearInterval(interval)
        }
    }, [iframeUrl])

    return (
        <Container className="h-full">
            {/* Cabeçalho da Página */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h3>Calendário</h3>
                </div>
                <div className="flex items-center gap-2">
                    {/* Botão Adicionar Compromisso */}
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlus />}
                        onClick={() => window.open('https://calendar.google.com/calendar/u/0/r/eventedit', '_blank')}
                    >
                        Novo Compromisso
                    </Button>
                </div>
            </div>

            {/* Google Calendar Iframe */}
            <div className="w-full" style={{ height: 'calc(100vh - 200px)' }}>
                <iframe
                    src={iframeUrl}
                    className="w-full h-full border-0 rounded-lg"
                    frameBorder="0"
                    scrolling="no"
                    title="Google Calendar"
                />
            </div>
        </Container>
    )
}

export default Calendar
