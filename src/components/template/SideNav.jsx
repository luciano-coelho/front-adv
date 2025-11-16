import classNames from '@/utils/classNames'
import ScrollBar from '@/components/ui/ScrollBar'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import { useThemeStore } from '@/store/themeStore'
import { useSessionUser } from '@/store/authStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import navigationConfig from '@/configs/navigation.config'
import appConfig from '@/configs/app.config'
import { Link } from 'react-router'
import { HiScale } from 'react-icons/hi2'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    SIDE_NAV_CONTENT_GUTTER,
    HEADER_HEIGHT,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant'

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = ({
    translationSetup = appConfig.activeNavTranslation,
    background = true,
    className,
    contentClass,
    mode,
}) => {
    const defaultMode = useThemeStore((state) => state.mode)
    const direction = useThemeStore((state) => state.direction)
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)

    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav',
                background && 'side-nav-bg',
                !sideNavCollapse && 'side-nav-expand',
                className,
            )}
        >
            <Link
                to={appConfig.authenticatedEntryPath}
                className={classNames(
                    "side-nav-header flex items-center justify-center",
                    sideNavCollapse ? "px-2" : "px-6"
                )}
                style={{ height: HEADER_HEIGHT }}
            >
                {sideNavCollapse ? (
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${(mode || defaultMode) === 'dark' ? 'bg-gray-700' : 'bg-gray-800'}`}>
                        <HiScale className="text-white text-lg" />
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${(mode || defaultMode) === 'dark' ? 'bg-gray-700' : 'bg-gray-800'}`}>
                            <HiScale className="text-white text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-bold text-lg ${(mode || defaultMode) === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                LegalOffice
                            </span>
                            <span className={`text-xs ${(mode || defaultMode) === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Advocacia & Consultoria
                            </span>
                        </div>
                    </div>
                )}
            </Link>
            <div className={classNames('side-nav-content', contentClass)}>
                <ScrollBar style={{ height: '100%' }} direction={direction}>
                    <VerticalMenuContent
                        collapsed={sideNavCollapse}
                        navigationTree={navigationConfig}
                        routeKey={currentRouteKey}
                        direction={direction}
                        translationSetup={translationSetup}
                        userAuthority={userAuthority || []}
                    />
                </ScrollBar>
            </div>
        </div>
    )
}

export default SideNav
