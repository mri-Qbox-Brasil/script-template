import React, { useState } from 'react'
import { usePluginBridgeGuest } from './plugin/usePluginBridgeGuest'
import { useIsEmbedded } from './plugin/useIsEmbedded'
import { useNuiEvent } from './context/NuiContext'
import { useAccentColor } from './hooks/useAccentColor'
import { useBackgroundColor } from './hooks/useBackgroundColor'
import { HelloPlugin } from './components/HelloPlugin'
import { ConfigPanel } from './components/ConfigPanel'
import { MriSpinner } from '@mriqbox/ui-kit'

type Tab = 'home' | 'config'

function PluginContent({ locale, accentColor, backgroundColor }: { locale?: string; accentColor: string; backgroundColor?: string }) {
    const [tab, setTab] = useState<Tab>('home')
    useAccentColor(accentColor)
    useBackgroundColor(backgroundColor)

    return (
        <div className="flex flex-col h-full w-full bg-background text-foreground">
            <div className="border-b border-border flex gap-4 px-6 pt-4">
                <button
                    className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                        tab === 'home'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setTab('home')}
                >
                    Home
                </button>
                <button
                    className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                        tab === 'config'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setTab('config')}
                >
                    Config
                </button>
            </div>
            <div className="flex-1 overflow-auto">
                {tab === 'home' && <HelloPlugin locale={locale} />}
                {tab === 'config' && <ConfigPanel locale={locale} />}
            </div>
        </div>
    )
}

function EmbeddedMode() {
    const { locale, accentColor, backgroundColor, initialized } = usePluginBridgeGuest()
    if (!initialized) {
        return (
            <div className="flex items-center justify-center h-full">
                <MriSpinner />
            </div>
        )
    }
    return <PluginContent locale={locale} accentColor={accentColor} backgroundColor={backgroundColor} />
}

function StandaloneMode() {
    const [visible, setVisible] = useState(false)
    useNuiEvent<boolean>('setVisible', setVisible)
    if (!visible) return null
    return <PluginContent accentColor="#00E699" />
}

const App: React.FC = () => {
    const embedded = useIsEmbedded()
    return embedded ? <EmbeddedMode /> : <StandaloneMode />
}

export default App
