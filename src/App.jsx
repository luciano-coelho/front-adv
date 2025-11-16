import { BrowserRouter } from 'react-router'
import { useEffect } from 'react'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import { useLocaleStore } from '@/store/localeStore'
import './locales'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    const { setLang } = useLocaleStore()

    // Forçar português brasileiro na inicialização
    useEffect(() => {
        console.log('🔄 Limpando localStorage e configurando pt-br')
        // Limpar configuração anterior do localStorage
        localStorage.removeItem('locale')
        // Forçar português brasileiro
        setLang('pt-br')
    }, [setLang])

    return (
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                    <Layout>
                        <Views />
                    </Layout>
                </AuthProvider>
            </BrowserRouter>
        </Theme>
    )
}

export default App
