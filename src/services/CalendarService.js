import ApiService from './ApiService'

export async function apiGetCalendar() {
    return ApiService.fetchDataWithAxios({
        url: '/calendar',
        method: 'get',
    })
}

// Fetch and parse an ICS (.ics) calendar URL (Google Calendar public ICS).
// Returns events in FullCalendar-friendly format: { id, title, start, end, allDay, extendedProps }
export async function apiGetCalendarFromIcs(icsUrl) {
    if (!icsUrl) return []
    
    console.log('Fetching ICS from:', icsUrl)
    
    try {
        // Try direct fetch first
        const res = await fetch(icsUrl)
        if (!res.ok) {
            console.error(`Failed to fetch ICS: ${res.status} ${res.statusText}`)
            throw new Error(`Failed to fetch ICS: ${res.status} ${res.statusText}`)
        }
        const text = await res.text()
        console.log('ICS text length:', text.length)
        console.log('ICS preview:', text.substring(0, 200))
        
        const events = parseIcs(text)
        console.log('Parsed events count:', events.length)
        console.log('Sample events:', events.slice(0, 2))
        
        return events
    } catch (error) {
        console.error('Direct ICS fetch failed (likely CORS), trying mock endpoint:', error)
        
        // Fallback to mock endpoint (server-side proxy)
        try {
            return await ApiService.fetchDataWithAxios({
                url: '/calendar/ics',
                method: 'get',
            })
        } catch (mockError) {
            console.error('Mock endpoint also failed:', mockError)
            throw error // throw original error
        }
    }
}

function parseIcs(icsText) {
    const events = []
    // Split each VEVENT block
    const vevents = icsText.split(/BEGIN:VEVENT/).slice(1)
    vevents.forEach((block) => {
        const lines = block.split(/\r?\n/)
        const ev = {}
        lines.forEach((line) => {
            if (!line || line.startsWith('END:VEVENT')) return
            // unfold folded lines (very simple approach)
            // split only at the first ':' to keep descriptions with colons
            const idx = line.indexOf(':')
            if (idx === -1) return
            const key = line.slice(0, idx)
            const value = line.slice(idx + 1)

            const keyBase = key.split(';')[0]
            switch (keyBase) {
                case 'UID':
                    ev.id = value.trim()
                    break
                case 'SUMMARY':
                    ev.title = value.trim()
                    break
                case 'DTSTART':
                    ev.start = parseIcsDate(value.trim())
                    break
                case 'DTEND':
                    ev.end = parseIcsDate(value.trim())
                    break
                case 'DESCRIPTION':
                    ev.description = value.trim()
                    break
                case 'LOCATION':
                    ev.location = value.trim()
                    break
                default:
                    break
            }
        })

        // If DTSTART exists and no DTEND, set end = start
        if (ev.start && !ev.end) {
            ev.end = ev.start
        }

        // Determine allDay: ICS dates with YYYYMMDD (no 'T') are all-day
        const allDay = ev.start && !/T/.test(ev.startRaw || ev.start)

        events.push({
            id: ev.id || `${ev.start}_${ev.title}`,
            title: ev.title || '(No title)',
            start: ev.start,
            end: ev.end,
            allDay: allDay,
            extendedProps: {
                description: ev.description,
                location: ev.location,
            },
        })
    })
    return events
}

function parseIcsDate(val) {
    // Accept formats like: 20251015 or 20251015T120000Z or 20251015T120000
    // Convert to ISO string using a best-effort approach
    // If value is date-only (YYYYMMDD) treat as local date
    if (!val) return undefined
    const clean = val.trim()
    // date-only
    if (/^\d{8}$/.test(clean)) {
        // Return YYYY-MM-DD which FullCalendar treats as allDay
        return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`
    }
    // Date-time possibly with Z
    // Insert colon in timezone offset if needed, or let the browser parse
    // Try to build ISO-like string
    if (/^\d{8}T\d{6}Z$/.test(clean)) {
        // 20251015T120000Z -> 2025-10-15T12:00:00Z
        return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}T${clean.slice(9, 11)}:${clean.slice(11, 13)}:${clean.slice(13, 15)}Z`
    }
    if (/^\d{8}T\d{6}$/.test(clean)) {
        // no timezone; assume local
        return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}T${clean.slice(9, 11)}:${clean.slice(11, 13)}:${clean.slice(13, 15)}`
    }
    // Fallback: return value as-is and let FullCalendar/Date parsing attempt
    return clean
}
