import { useEffect, useMemo, useState } from 'react'

// Lê os JSONs em `locales/` via fetch em runtime — edit no JSON precisa só de
// restart do resource, sem rebuild do web. Funciona porque o fxmanifest declara
// `locales/*.json` no files{}, expondo via `https://cfx-nui-{resource}/locales/{lang}.json`.
//
// Em dev (Vite dev server), o middleware em vite.config serve esses mesmos
// arquivos a partir da raiz do resource (`../locales/`).

const DEFAULT_LOCALE = 'pt-br'

const cache: Record<string, Record<string, any>> = {}
const pending: Record<string, Promise<Record<string, any>>> = {}

async function loadLocale(lang: string): Promise<Record<string, any>> {
    if (cache[lang]) return cache[lang]
    if (pending[lang]) return pending[lang]
    pending[lang] = (async () => {
        try {
            const res = await fetch(`/locales/${lang}.json`)
            if (!res.ok) throw new Error(`Locale ${lang} not found`)
            const data = await res.json()
            cache[lang] = data
            return data
        } catch (err) {
            console.warn(`[useLocales] Falha ao carregar ${lang}:`, err)
            cache[lang] = {}
            return cache[lang]
        } finally {
            delete pending[lang]
        }
    })()
    return pending[lang]
}

function resolveLocale(input?: string): string {
    return (input || DEFAULT_LOCALE).toLowerCase()
}

function lookup(dict: unknown, path: string): string {
    const parts = path.split('.')
    let cur: any = dict
    for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) {
            cur = cur[p]
        } else {
            return path
        }
    }
    return typeof cur === 'string' ? cur : path
}

function interpolate(template: string, args?: Record<string, string | number>): string {
    if (!args) return template
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        const v = args[key]
        return v === undefined ? `{${key}}` : String(v)
    })
}

export function useLocales(locale?: string) {
    const lang = resolveLocale(locale)
    const [dict, setDict] = useState<Record<string, any>>(() => cache[lang] ?? {})
    const [loading, setLoading] = useState(!cache[lang])

    useEffect(() => {
        let cancelled = false
        if (cache[lang]) {
            setDict(cache[lang])
            setLoading(false)
            return
        }
        setLoading(true)
        loadLocale(lang).then((data) => {
            if (cancelled) return
            setDict(data)
            setLoading(false)
        })
        return () => { cancelled = true }
    }, [lang])

    return useMemo(() => {
        const t = (path: string, args?: Record<string, string | number>) =>
            interpolate(lookup(dict, path), args)
        return { t, locale: lang, loading }
    }, [dict, lang, loading])
}
