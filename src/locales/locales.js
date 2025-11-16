import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './lang/en.json'
import zh from './lang/zh.json'
import es from './lang/es.json'
import ar from './lang/ar.json'
import ptBr from './lang/pt-br.json'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

const resources = {
    en: {
        translation: en,
    },
    zh: {
        translation: zh,
    },
    es: {
        translation: es,
    },
    ar: {
        translation: ar,
    },
    'pt-br': {
        translation: ptBr,
    },
}

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'pt-br',
    lng: 'pt-br',
    debug: true, // Para debug
    interpolation: {
        escapeValue: false,
    },
})

// Configurar dayjs para português brasileiro imediatamente
dayjs.locale('pt-br')

// Forçar mudança para português
i18n.changeLanguage('pt-br')
console.log('🌍 Idioma configurado para:', i18n.language)

export const dateLocales = {
    en: () => import('dayjs/locale/en'),
    es: () => import('dayjs/locale/es'),
    zh: () => import('dayjs/locale/zh'),
    ar: () => import('dayjs/locale/ar'),
    'pt-br': () => import('dayjs/locale/pt-br'),
}

export default i18n
