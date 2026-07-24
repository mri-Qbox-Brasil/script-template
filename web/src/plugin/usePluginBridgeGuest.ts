import { useCallback, useEffect, useRef, useState } from 'react'
import {
    isMriPluginMessage,
    MriPluginGuestMessage,
    MriPluginHostMessage,
} from './types'

interface PluginContext {
    accentColor: string
    backgroundColor: string
    /** Config visual do /uiconfig do ox_lib repassado pelo Qadmin. `null` até
     *  o init. Consumido pelo applyUiConfig do ui-kit (ignora chave desconhecida). */
    uiConfig: Record<string, unknown> | null
    locale: string
    perms: string[]
    initialized: boolean
}

interface UsePluginBridgeGuestOptions {
    defaultAccentColor?: string
    defaultLocale?: string
    onClose?: () => void
}

/**
 * Guest-side bridge (plugin). Envia `ready` no mount, escuta `init` /
 * `theme-changed` / `close` do host, e expõe métodos pra responder.
 *
 * ```tsx
 * const { accentColor, locale, perms, initialized, requestClose } = usePluginBridgeGuest()
 * if (!initialized) return <Loading/>
 * ```
 */
export function usePluginBridgeGuest(opts: UsePluginBridgeGuestOptions = {}) {
    const { defaultAccentColor = '#00E699', defaultLocale = 'pt-BR', onClose } = opts

    const [context, setContext] = useState<PluginContext>({
        accentColor: defaultAccentColor,
        backgroundColor: '',
        uiConfig: null,
        locale: defaultLocale,
        perms: [],
        initialized: false,
    })

    const onCloseRef = useRef(onClose)
    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    const sendToHost = useCallback((msg: MriPluginGuestMessage): boolean => {
        if (typeof window === 'undefined') return false
        if (window.self === window.top) return false
        window.parent.postMessage(msg, '*')
        return true
    }, [])

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            if (!isMriPluginMessage(event.data)) return
            const msg = event.data as MriPluginHostMessage
            switch (msg.type) {
                case 'mri-plugin/init':
                    setContext({
                        accentColor: msg.accentColor,
                        backgroundColor: msg.backgroundColor ?? '',
                        uiConfig: msg.uiConfig ?? null,
                        locale: msg.locale,
                        perms: msg.perms,
                        initialized: true,
                    })
                    break
                case 'mri-plugin/theme-changed':
                    // uiConfig com `?? prev`: theme-changed as vezes vem so com
                    // accent, e sobrescrever com undefined perderia o do init.
                    setContext((prev) => ({ ...prev, accentColor: msg.accentColor, backgroundColor: msg.backgroundColor ?? prev.backgroundColor, uiConfig: msg.uiConfig ?? prev.uiConfig }))
                    break
                case 'mri-plugin/perms-changed':
                    setContext((prev) => ({ ...prev, perms: msg.perms }))
                    break
                case 'mri-plugin/close':
                    onCloseRef.current?.()
                    break
            }
        }
        window.addEventListener('message', onMessage)
        sendToHost({ type: 'mri-plugin/ready' })
        return () => window.removeEventListener('message', onMessage)
    }, [sendToHost])

    const requestClose = useCallback(() => {
        sendToHost({ type: 'mri-plugin/request-close' })
    }, [sendToHost])

    return { ...context, requestClose }
}
