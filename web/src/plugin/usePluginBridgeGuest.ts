import { useCallback, useEffect, useRef, useState } from 'react'
import {
    isMriPluginMessage,
    MriPluginGuestMessage,
    MriPluginHostMessage,
} from './types'

interface PluginContext {
    accentColor: string
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
                        locale: msg.locale,
                        perms: msg.perms,
                        initialized: true,
                    })
                    break
                case 'mri-plugin/theme-changed':
                    setContext((prev) => ({ ...prev, accentColor: msg.accentColor }))
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
