import { useEffect } from 'react'

function hexToHslVar(hex: string): string | null {
    const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i)
    if (!m) return null
    const r = parseInt(m[1], 16) / 255
    const g = parseInt(m[2], 16) / 255
    const b = parseInt(m[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2
    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
        else if (max === g) h = (b - r) / d + 2
        else h = (r - g) / d + 4
        h *= 60
    }
    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Aplica `accentColor` (hex) nos tokens shadcn `--primary` e `--ring`.
 * `--ring` precisa atualizar junto com `--primary` — sem ele o focus state
 * dos inputs fica preso na cor default mesmo com accent mudado.
 */
export function useAccentColor(accentColor: string): void {
    useEffect(() => {
        const hsl = hexToHslVar(accentColor)
        if (!hsl) return
        const root = document.documentElement.style
        root.setProperty('--primary', hsl)
        root.setProperty('--ring', hsl)
    }, [accentColor])
}
