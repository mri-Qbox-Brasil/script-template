# <recurso> — Manual

<Uma frase dizendo o que o recurso faz e para quem serve.>

---

## Sumário

1. [Dependências](#dependências)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Comandos](#comandos)
5. [Integrações](#integrações)
6. [Entrypoints para outros recursos](#entrypoints-para-outros-recursos)
7. [Localização](#localização)
8. [Estrutura de arquivos](#estrutura-de-arquivos)

---

## Dependências

| Recurso | Obrigatório | Observação |
|---|---|---|
| `qbx_core` | Sim | Framework base |
| `ox_lib` | Sim | Callbacks, locale |
| `oxmysql` | Não | Apenas se o recurso persistir dados |

---

## Instalação

1. Copie a pasta `<recurso>` para `resources/`.
2. Adicione ao `server.cfg`:
   ```
   ensure <recurso>
   ```
3. Importe o SQL, se houver.
4. **Conflitos** — avise aqui se o recurso substitui outro (ex.: não rodar junto com `qbx_spawn`).

---

## Permissões (ACE)

Só inclua esta seção se o recurso usar ACE de fato.

```
add_ace group.admin <recurso>.admin allow
```

---

## Configuração

Documente o arquivo real (`shared/config.lua`, `config/config.lua`, `data/config.json`…).
Cada opção vira uma linha da tabela — nunca escreva apenas "veja o config".

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `Config.Debug` | bool | Não | Ativa logs de diagnóstico no console F8 |

---

## Comandos

| Comando | Permissão | Descrição |
|---|---|---|
| `/exemplo` | admin | O que o comando faz |

---

## Integrações

Uma subseção `###` por recurso opcional integrado, explicando o que muda quando ele está presente.

---

## Entrypoints para outros recursos

Exports e eventos que outros recursos podem chamar. Liste apenas o que existe no código.

```lua
exports['<recurso>']:MinhaFuncao(arg)
```

---

## Localização

Só se existir `locales/`. Liste os idiomas disponíveis e a convar:

```
setr ox:locale "pt-br"
```

---

## Estrutura de arquivos

Árvore real do repositório, com um comentário curto por arquivo relevante.

```
<recurso>/
├── client/
│   └── main.lua          — descrição
├── server/
│   └── main.lua          — descrição
└── fxmanifest.lua
```

<!--
PADRÃO (referência canônica: MANUAL.md do mri_Qspawn)

- Português do Brasil, tom direto, sem marketing e sem emoji.
- Título `# <recurso> — Manual`, seguido de UMA frase de resumo.
- `## Sumário` numerado, com âncoras que batem com os títulos.
- `---` separando as seções de topo.
- Toda configuração e todo comando em TABELA, não em bullet solto.
- Blocos de código sempre com linguagem (```lua, ```json, ```sql).
- Só documente o que existe no código. Seção que não se aplica ao recurso
  (ex.: sem locales/, sem ACE) deve ser OMITIDA — nunca preenchida com invenção.
- Seções extras específicas do recurso são bem-vindas; mantenha o esqueleto.
-->
