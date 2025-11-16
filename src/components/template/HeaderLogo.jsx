import { useThemeStore } from '@/store/themeStore'
import appConfig from '@/configs/app.config'
import { Link } from 'react-router'
import { HiScale } from 'react-icons/hi2'
import { APP_NAME } from '@/constants/app.constant'

const HeaderLogo = ({ mode }) => {
    const defaultMode = useThemeStore((state) => state.mode)
    const currentMode = mode || defaultMode

    return (
        <Link 
            to={appConfig.authenticatedEntryPath}
            className="flex items-center gap-3"
        >
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${currentMode === 'dark' ? 'bg-gray-700' : 'bg-gray-800'}`}>
                <HiScale 
                    className="text-white text-xl" 
                />
            </div>
            <div className="flex flex-col">
                <span className={`font-bold text-lg ${currentMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    LegalOffice
                </span>
                <span className={`text-xs ${currentMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Advocacia & Consultoria
                </span>
            </div>
        </Link>
    )
}

export default HeaderLogo
