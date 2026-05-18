import React, { useEffect } from 'react'

interface NuiMessageData<T = any> {
    action: string
    data: T
}

function detectResourceName(): string {
    if (typeof window !== 'undefined') {
        const match = window.location.hostname.match(/^cfx-nui-(.+)$/)
        if (match) return match[1]
        if ((window as any).GetParentResourceName) {
            return (window as any).GetParentResourceName()
        }
    }
    return 'nui-frame-app'
}

export function useNuiEvent<T = any>(action: string, handler: (data: T) => void): void {
    const savedHandler = React.useRef(handler)

    useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect(() => {
        const listener = (event: MessageEvent<NuiMessageData<T>>) => {
            if (event.data?.action === action) {
                savedHandler.current(event.data.data)
            }
        }
        window.addEventListener('message', listener)
        return () => window.removeEventListener('message', listener)
    }, [action])
}

export async function fetchNui<T = any>(eventName: string, data?: unknown): Promise<T> {
    const resourceName = detectResourceName()
    const resp = await fetch(`https://${resourceName}/${eventName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data ?? {}),
    })
    return resp.json() as Promise<T>
}
