import { mock } from '../MockAdapter'
import { calendarData } from '../data/calendarData'

mock.onGet(`/api/calendar`).reply(() => {
    return [200, calendarData]
})

// Mock endpoint to fetch ICS calendar (proxy to avoid CORS)
mock.onGet('/api/calendar/ics').reply(async () => {
    try {
        // In a real implementation, this would be server-side
        // For now, we'll try to fetch directly (might have CORS issues)
        const icsUrl = 'https://calendar.google.com/calendar/ical/lucianofigueiredoc%40gmail.com/private-868d773827f5fb461cee020a480d8506/basic.ics'
        
        const response = await fetch(icsUrl)
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }
        
        const icsText = await response.text()
        
        // Parse ICS to events format (simplified parser)
        const events = parseIcsToEvents(icsText)
        
        return [200, events]
    } catch (error) {
        console.error('Error fetching ICS:', error)
        // Return fallback events if ICS fetch fails
        return [200, [
            {
                id: 'fallback-1',
                title: 'ICS Fetch Failed - Demo Event',
                start: new Date().toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0],
                allDay: true,
                extendedProps: {
                    description: 'Unable to fetch from Google Calendar ICS. Check console for CORS errors.',
                }
            }
        ]]
    }
})

function parseIcsToEvents(icsText) {
    const events = []
    const vevents = icsText.split(/BEGIN:VEVENT/).slice(1)
    
    vevents.forEach((block) => {
        const lines = block.split(/\r?\n/)
        const event = {}
        
        lines.forEach((line) => {
            if (!line || line.startsWith('END:VEVENT')) return
            
            const idx = line.indexOf(':')
            if (idx === -1) return
            
            const key = line.slice(0, idx).split(';')[0]
            const value = line.slice(idx + 1).trim()
            
            switch (key) {
                case 'UID':
                    event.id = value
                    break
                case 'SUMMARY':
                    event.title = value
                    break
                case 'DTSTART':
                    event.start = parseIcsDate(value)
                    break
                case 'DTEND':
                    event.end = parseIcsDate(value)
                    break
                case 'DESCRIPTION':
                    event.description = value
                    break
                case 'LOCATION':
                    event.location = value
                    break
            }
        })
        
        if (event.title && event.start) {
            events.push({
                id: event.id || `${event.start}_${event.title}`,
                title: event.title,
                start: event.start,
                end: event.end || event.start,
                allDay: !event.start.includes('T'),
                extendedProps: {
                    description: event.description,
                    location: event.location,
                }
            })
        }
    })
    
    return events
}

function parseIcsDate(dateStr) {
    if (!dateStr) return null
    
    // Handle date-only format: YYYYMMDD
    if (/^\d{8}$/.test(dateStr)) {
        return `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`
    }
    
    // Handle datetime format: YYYYMMDDTHHMMSSZ
    if (/^\d{8}T\d{6}Z?$/.test(dateStr)) {
        const date = `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`
        const time = `${dateStr.slice(9,11)}:${dateStr.slice(11,13)}:${dateStr.slice(13,15)}`
        return `${date}T${time}${dateStr.endsWith('Z') ? 'Z' : ''}`
    }
    
    return dateStr
}
