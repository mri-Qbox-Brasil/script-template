// Detecta se o plugin está rodando dentro do mri_Qadmin (modo embedded) ou
// standalone (NUI própria aberta via comando do plugin).
//
// IMPORTANTE: NÃO pode usar `window.self !== window.top` no FiveM, porque
// toda NUI do FiveM já roda dentro de um iframe do CEF — essa verificação
// dá true mesmo em standalone, fazendo o plugin cair no modo embedded e
// travar em loading eterno esperando init que nunca vem.
//
// Sinal confiável: query param `?embedded=1`, que o Qadmin injeta na URL
// do iframe via MriPluginHost. Standalone abre sem query → false.

export const useIsEmbedded = (): boolean => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('embedded') === '1'
}
