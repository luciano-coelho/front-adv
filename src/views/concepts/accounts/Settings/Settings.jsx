import { lazy, Suspense } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import SettingsMenu from './components/SettingsMenu'
import SettingMobileMenu from './components/SettingMobileMenu'
import TeamForm from './components/TeamForm'
import TeamList from './components/TeamList'
import useResponsive from '@/utils/hooks/useResponsive'
import { useSettingsStore } from './store/settingsStore'

const Profile = lazy(() => import('./components/SettingsProfile'))
const Security = lazy(() => import('./components/SettingsSecurity'))
const Notification = lazy(() => import('./components/SettingsNotification'))
const Billing = lazy(() => import('./components/SettingsBilling'))
const Integration = lazy(() => import('./components/SettingIntegration'))
const Calendar = lazy(() => import('./components/SettingsCalendar'))

import { useState } from 'react'
import { teamListMockData } from '@/mock/teamListMockData'

const Settings = () => {
    const { currentView } = useSettingsStore()
    const { smaller, larger } = useResponsive()
    const [showTeamForm, setShowTeamForm] = useState(false)
    const [team, setTeam] = useState(teamListMockData)


    const handleAddMember = () => setShowTeamForm(true)
    const handleFormClose = () => setShowTeamForm(false)

    const handleSaveMember = (data) => {
        if (team.length < 5) {
            setTeam([...team, { ...data, id: Date.now() }])
            setShowTeamForm(false)
        }
    }

    const handleRemoveMember = (id) => {
        setTeam(team.filter(member => member.id !== id))
    }

    return (
        <AdaptiveCard className="h-full">
            <div className="flex flex-auto h-full">
                {larger.lg && (
                    <div className="'w-[200px] xl:w-[280px]">
                        <SettingsMenu />
                    </div>
                )}
                <div className="xl:ltr:pl-6 xl:rtl:pr-6 flex-1 py-2">
                    {smaller.lg && (
                        <div className="mb-6">
                            <SettingMobileMenu />
                        </div>
                    )}
                    <Suspense fallback={<></>}>
                        {currentView === 'profile' && <Profile />}
                        {currentView === 'security' && <Security />}
                        {currentView === 'notification' && <Notification />}
                        {currentView === 'billing' && <Billing />}
                        {currentView === 'integration' && <Integration />}
                        {currentView === 'calendar' && <Calendar />}
                        {currentView === 'team' && !showTeamForm && (
                            <TeamList
                                team={team}
                                onAddMember={handleAddMember}
                                onRemoveMember={handleRemoveMember}
                            />
                        )}
                        {currentView === 'team' && showTeamForm && (
                            <TeamForm
                                onClose={handleFormClose}
                                onSave={handleSaveMember}
                                disableSave={team.length >= 5}
                            />
                        )}
                    </Suspense>
                </div>
            </div>
        </AdaptiveCard>
    )
}

export default Settings
