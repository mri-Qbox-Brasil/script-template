# Plugin Template — mri_Qadmin

Branch `react-qadmin-plugin` do `script-template`. Forka isso pra criar um plugin que:

- Aparece no sidebar do `mri_Qadmin` (ícone + label).
- Roda dual-mode: standalone via NUI command **e** embedded num iframe do Qadmin.
- Tem aba "Configurações" persistida em `data/config.json`, com broadcast em runtime.
- Usa `@mriqbox/ui-kit` pré-baked com tema shadcn alinhado com o accent da suite (`mri:color` convar).

## Como rodar

1. **Renomeie** referências `plugintest` → `meuplugin` em:
   - `fxmanifest.lua` (description)
   - `server/main.lua` (`id`, `label`, `icon`, `requiredPerms`)
   - `server/config.lua` (`isAdmin`, callbacks `plugintest:server:*`)
   - `client/main.lua` (callbacks + `RegisterCommand`)
2. **`pnpm install`** em `web/`.
3. **`pnpm build`** em `web/` — sai em `html/` (relativo à raiz do resource).
4. Inicia o resource. Vai aparecer no sidebar do Qadmin se ele estiver rodando + se o player tiver `meuplugin.admin` ou `command` ACE.
5. Standalone: `/plugintest` (renomeie pro seu nome).

## Arquitetura

```
client/main.lua          NUI command + callbacks (config get/save) + cache local
server/main.lua          Registro do plugin no Qadmin + convar mri:color watcher
server/config.lua        Storage de data/config.json + broadcast
data/config.json         Persistência (commit no repo como seed)
web/src/
├── App.tsx              Dual-mode: EmbeddedMode | StandaloneMode
├── plugin/
│   ├── types.ts                 Contrato do bridge (drift 1:1 com Qadmin)
│   ├── useIsEmbedded.ts         Detecta ?embedded=1 (NÃO usar window.self)
│   └── usePluginBridgeGuest.ts  Bridge postMessage (ready/init/theme/close)
├── hooks/useAccentColor.ts      Aplica hex → --primary + --ring HSL
├── hooks/useBackgroundColor.ts  Aplica hex → ladder de vars CSS de fundo
├── components/HelloPlugin.tsx   Conteúdo da rota "home"
└── components/ConfigPanel.tsx   Conteúdo da rota "config"
```

## Protocolo do bridge

Quando hosted no Qadmin:

1. Plugin monta → `usePluginBridgeGuest` manda `mri-plugin/ready` pro parent.
2. Host responde com `mri-plugin/init` (`accentColor`, `backgroundColor?`, `locale`, `perms`).
3. Runtime: accent ou background muda → host manda `mri-plugin/theme-changed` (`accentColor`, `backgroundColor?`).
4. User clica X interno → plugin manda `mri-plugin/request-close`.
5. Se host quer fechar o plugin (raro) → manda `mri-plugin/close`.

`backgroundColor` é opcional — ausente significa "use o padrão do tema".

Standalone, o bridge fica sem parent — `sendToHost` retorna `false` silenciosamente.

## Manifest do plugin

```lua
exports['mri_Qadmin']:RegisterPlugin({
    id = 'meuplugin',                  -- kebab-case único
    label = 'Meu Plugin',              -- texto no sidebar
    icon = 'box',                      -- nome lucide kebab-case
    resource = GetCurrentResourceName(),
    htmlPath = 'html/index.html',      -- não omitir se você builda pra html/
    requiredPerms = { 'meuplugin.admin', 'command' }, -- OR semantic
    permDefs = {                       -- opcional: perms gerenciáveis pela UI do Qadmin
        { id = 'meuplugin.admin', label = 'Administrador', desc = 'Acesso total ao plugin' },
    },
    description = 'Descrição curta',
})
```

## Gotchas

- **`window.self !== window.top` dá true sempre no CEF do FiveM** — use `?embedded=1` como sinal.
- **`useNuiEvent` espera `event.data.data`** — o Lua precisa mandar `SendNUIMessage({ action='X', data={...} })`.
- **`--ring` precisa atualizar junto com `--primary`** quando o accent muda.
- **`useBackgroundColor`** limpa todas as vars de fundo quando recebe `''` ou `undefined` — restaura o tema padrão sem efeito colateral.
- **`no-scrollbar` não é Tailwind built-in** — está definido em `styles.css`.
- **`backdrop-blur-*` não renderiza no CEF do FiveM** — evite usar.
- **ACE com OR semantic** — listar `command` cobre god/console como fallback.

## Adicionando um novo setting

1. **`server/config.lua`** — adiciona em `DEFAULTS`.
2. **`web/src/components/ConfigPanel.tsx`** — adiciona em `DEFAULTS` + cria o input.
3. (Opcional) **`client/main.lua`** — se precisa reagir no client quando o setting muda.
