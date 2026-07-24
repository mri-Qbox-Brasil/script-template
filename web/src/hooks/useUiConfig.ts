import { useEffect } from 'react'
import { applyUiConfig } from '@mriqbox/ui-kit'

/**
 * Aplica no documento o config visual do painel /uiconfig do ox_lib, recebido
 * do mri_Qadmin pelo bridge de plugin. Chamar só no modo embedded.
 *
 * - `applyUiConfig` do ui-kit cuida de --radius, fonte, cores de status,
 *   opacidade do glass e dimensões.
 * - `data-theme` é setado aqui (o helper não mexe nele) e liga o bloco glass
 *   do index.css.
 *
 * CSS var não atravessa iframe — nada é herdado do host, tem que ser
 * reaplicado neste documento.
 */
export function useUiConfig(uiConfig: Record<string, unknown> | null): void {
    useEffect(() => {
        if (!uiConfig) return
        applyUiConfig(uiConfig)
        const theme = uiConfig.theme === 'glass' ? 'glass' : 'dark'
        document.documentElement.setAttribute('data-theme', theme)
    }, [uiConfig])
}
