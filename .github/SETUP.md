# Configuração — Script Template MRI

Este guia descreve o que precisa ser feito ao criar um novo repositório de script FiveM a partir deste template.

---

## 1. Pré-requisitos (uma vez por organização)

### 1.1 PAT `GH_TOKEN`

Os workflows precisam de um **Personal Access Token** com permissões além do `GITHUB_TOKEN` padrão.

1. Acesse **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Crie um token com escopo na organização `mri-Qbox-Brasil`
3. Permissões mínimas:
   - **Contents**: Read & Write
   - **Pull requests**: Read & Write
   - **Packages**: Read
   - **Actions**: Read & Write
4. Salve como secret de organização `GH_TOKEN` em **Settings → Secrets and variables → Actions**

---

## 2. Configuração por repositório

### 2.1 Secrets e variáveis

Acesse **Settings → Secrets and variables → Actions** e configure:

| Nome | Tipo | Obrigatório para | Descrição |
|---|---|---|---|
| `GH_TOKEN` | Secret | Todos | PAT da organização (ver 1.1) |
| `AI_API_KEY` | Secret | `generate-docs` | Chave da API de IA |
| `AI_BASE_URL` | Variable | `generate-docs` | URL base da API (vazio = OpenAI) |
| `AI_MODEL` | Variable | `generate-docs` | Modelo a usar (ex: `gpt-4o-mini`) |
| `PR_TEAM` | Variable | `update-actions` | Time do GitHub para atribuir PRs. Opcional. |

### 2.2 `fxmanifest.lua`

Certifique-se de que o arquivo contém o placeholder de versão:

```lua
version '__VERSION__'
```

### 2.3 `repo-dispatch.yml`

Edite o `friendly-name` no workflow `.github/workflows/repo-dispatch.yml` com o nome do script como deve aparecer na sidebar da documentação.

### 2.4 Convenção de commits

| Prefixo | Versão gerada | Exemplo |
|---|---|---|
| `fix:` | Patch (1.0.**1**) | `fix: corrige crash ao abrir inventário` |
| `feat:` | Minor (1.**1**.0) | `feat: adiciona sistema de crafting` |
| `feat!:` ou `BREAKING CHANGE` | Major (**2**.0.0) | `feat!: refatora API de eventos` |
| `chore:`, `docs:`, `refactor:` | Nenhuma release | `chore: atualiza dependências` |

---

## 3. Workflows incluídos

| Workflow | Trigger | O que faz |
|---|---|---|
| `release.yml` | Push na `main` | Build + release semântico automatizado |
| `generate-docs.yml` | Push na `main` (código alterado) | Regenera README e MANUAL via IA |
| `update-actions.yml` | 1º de cada mês | Atualiza versões das GitHub Actions |
| `repo-dispatch.yml` | Push na `main` (MANUAL alterado) | Notifica o repo de documentação |
| `template-sync.yml` | Toda segunda-feira | Abre PR com atualizações do template |

Todos os workflows delegam para os callables em `mri-Qbox-Brasil/template-fivem`.

---

## 4. Checklist de configuração

- [ ] Secret `GH_TOKEN` disponível (herdado da org ou criado no repo)
- [ ] Secret `AI_API_KEY` configurado
- [ ] Variável `AI_BASE_URL` configurada (ou vazia para OpenAI)
- [ ] Variável `AI_MODEL` configurada
- [ ] `fxmanifest.lua` contém `version '__VERSION__'`
- [ ] Templates de doc existem em `.github/templates/`
- [ ] `friendly-name` atualizado em `repo-dispatch.yml`
- [ ] Commits seguem Conventional Commits
