import { useState, useEffect } from 'react'
import { HiPlus } from 'react-icons/hi'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'

const Schedule = ({ data = [] }) => {
    const [iframeUrl, setIframeUrl] = useState(() => {
        return localStorage.getItem('googleCalendarUrl') || 
               'https://calendar.google.com/calendar/embed?src=pt-br.brazilian%23holiday%40group.v.calendar.google.com&ctz=America%2FSao_Paulo&bgcolor=%23FFFFFF&color=%23000000&mode=WEEK&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&hl=pt-BR&wkst=1&lang=pt-BR'
    })

    useEffect(() => {
        const handleStorageChange = () => {
            const newUrl = localStorage.getItem('googleCalendarUrl')
            if (newUrl && newUrl !== iframeUrl) {
                setIframeUrl(newUrl)
            }
        }

        window.addEventListener('storage', handleStorageChange)
        
        // Verifica mudanças no mesmo tab
        const interval = setInterval(() => {
            const currentUrl = localStorage.getItem('googleCalendarUrl')
            if (currentUrl && currentUrl !== iframeUrl) {
                setIframeUrl(currentUrl)
            }
        }, 2000)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            clearInterval(interval)
        }
    }, [iframeUrl])

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h4>Calendário</h4>
                <Tooltip title="Novo Compromisso">
                    <Button
                        variant="solid"
                        size="xs"
                        icon={<HiPlus />}
                        onClick={() => window.open('https://calendar.google.com/calendar/u/0/r/eventedit', '_blank')}
                    />
                </Tooltip>
            </div>
            <div className="mt-4">
                <div className="relative w-full" style={{ height: '400px' }}>
                    <iframe
                        src={iframeUrl}
                        style={{
                            border: 'none',
                            width: '100%',
                            height: '100%',
                            borderRadius: '8px',
                            backgroundColor: '#f8f9fa'
                        }}
                        frameBorder="0"
                        scrolling="no"
                        title="Google Calendar"
                        allow="calendar"
                    />
                </div>
            </div>
        </Card>
    )
}

export default Schedule
