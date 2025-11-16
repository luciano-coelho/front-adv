import appConfig from '@/configs/app.config'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import i18n from 'i18next'
import { dateLocales } from '@/locales'
import dayjs from 'dayjs'

export const useLocaleStore = create()(
    devtools(
        persist(
            (set) => ({
                currentLang: 'pt-br', // Forçar português brasileiro
                setLang: (lang) => {
                    // Usar o código de idioma diretamente para i18n
                    i18n.changeLanguage(lang)

                    // Para dayjs, usar formatação específica
                    const dayjsLang = lang === 'pt-br' ? 'pt-br' : lang.replace(
                        /-([a-z])/g,
                        function (g) {
                            return g[1].toUpperCase()
                        },
                    )

                    if (dateLocales[lang]) {
                        dateLocales[lang]().then(() => {
                            dayjs.locale(dayjsLang)
                        })
                    }

                    return set({ currentLang: lang })
                },
            }),
            { name: 'locale' },
        ),
    ),
)
