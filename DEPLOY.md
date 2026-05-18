# Freela — Guia de Deploy Completo

> Stack: Next.js 14 + Supabase + Vercel  
> Email: raphaellimaduarte@gmail.com  
> Tempo estimado: ~30 minutos

---

## Pré-requisitos

- Node.js 20+ instalado
- Git instalado
- Conta GitHub com repositório criado
- Conta Supabase (supabase.com)
- Conta Vercel (vercel.com)

---

## PASSO 1 — Instalar dependências locais

```bash
cd freela-app
npm install
```

Verifique se tudo compilou:
```bash
npm run type-check
```

---

## PASSO 2 — Configurar Supabase (Projeto na Nuvem)

### 2.1 Criar projeto

1. Acesse https://supabase.com → Login com raphaellimaduarte@gmail.com
2. Clique em **New Project**
3. Preencha:
   - **Name**: `freela-prod`
   - **Database Password**: gere uma senha forte e salve
   - **Region**: `South America (São Paulo)` ← importante para latência BR
   - **Pricing Plan**: Free (começa aqui, upgrade depois)
4. Aguarde ~2 minutos para o projeto inicializar

### 2.2 Pegar as credenciais

No dashboard do projeto → **Settings → API**:

Copie:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (nunca exponha no frontend)

### 2.3 Rodar as migrações

**Opção A — via Dashboard SQL Editor** (mais simples):

1. No Supabase → **SQL Editor → New Query**
2. Abra e execute cada arquivo na ordem:
   - `supabase/migrations/001_extensions_enums.sql`
   - `supabase/migrations/002_users.sql`
   - `supabase/migrations/003_shops_providers.sql`
   - `supabase/migrations/004_service_orders.sql`
   - `supabase/migrations/005_invitations_executions.sql`
   - `supabase/migrations/006_matching_function.sql`
   - `supabase/migrations/007_storage.sql`

**Opção B — via CLI** (requer Supabase CLI instalado):

```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Linkear ao projeto (pega o Project ID no dashboard → Settings → General)
supabase link --project-ref SEU_PROJECT_ID

# Rodar migrações
supabase db push
```

### 2.4 Configurar autenticação

No Supabase → **Authentication → URL Configuration**:
- **Site URL**: `https://freela-app.vercel.app` (adicionar depois do deploy)
- **Redirect URLs**: `https://freela-app.vercel.app/**`

No Supabase → **Authentication → Email Templates**:
- Personalize os templates com a marca Freela (opcional)

### 2.5 Verificar RLS

No Supabase → **Table Editor** → clique em cada tabela → verifique que **RLS está habilitado** (cadeado fechado).

---

## PASSO 3 — Configurar variáveis de ambiente locais

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com os valores do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Teste localmente:
```bash
npm run dev
```

Acesse http://localhost:3000 — deve redirecionar para `/login`.

---

## PASSO 4 — Push para GitHub

```bash
# Dentro de freela-app/
git init
git add .
git commit -m "feat: initial Freela scaffold"

# Crie um repo no GitHub (github.com/new)
# Nome sugerido: freela-app

git remote add origin https://github.com/raphaellimaduarte/freela-app.git
git branch -M main
git push -u origin main
```

---

## PASSO 5 — Deploy na Vercel

### 5.1 Importar projeto

1. Acesse https://vercel.com → Login com raphaellimaduarte@gmail.com
2. **Add New → Project**
3. **Import Git Repository** → selecione `freela-app`
4. Configure:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (ou `freela-app/` se estiver em subpasta)
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

### 5.2 Adicionar variáveis de ambiente

Na tela de deploy → **Environment Variables**, adicione TODAS as variáveis do `.env.local`:

| Key | Environments |
|-----|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Production, Preview, Development |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Production, Preview, Development |
| SUPABASE_SERVICE_ROLE_KEY | Production, Preview, Development |
| NEXT_PUBLIC_APP_URL | Production: https://freela-app.vercel.app |
| RESEND_API_KEY | Production, Preview |
| ZAPI_INSTANCE_ID | Production |
| ZAPI_TOKEN | Production |
| ZAPI_CLIENT_TOKEN | Production |

### 5.3 Deploy

Clique em **Deploy**. Aguarde ~2 minutos.

URL gerada: `https://freela-app.vercel.app` (ou similar).

### 5.4 Atualizar Supabase com a URL da Vercel

Volte ao Supabase → **Authentication → URL Configuration**:
- Atualize o **Site URL** para a URL da Vercel
- Adicione nos **Redirect URLs**: `https://freela-app.vercel.app/**`

---

## PASSO 6 — Configurar Z-API (WhatsApp)

### 6.1 Criar instância

1. Acesse https://z-api.io → Criar conta gratuita
2. **Criar Instância** → copie `Instance ID` e `Token`
3. Escaneie o QR Code com o WhatsApp do número da Freela
4. Copie também o `Client-Token` (gerado automaticamente)

### 6.2 Configurar Webhook

No Z-API → **Webhooks**:
- **URL do Webhook**: `https://freela-app.vercel.app/api/webhooks/zapi`
- Ative: `Received`

### 6.3 Testar

Mande "1" para o número configurado — deve aparecer nos logs da Vercel.

---

## PASSO 7 — Configurar Resend (Email)

1. Acesse https://resend.com → Criar conta
2. **API Keys → Create API Key** → copie
3. **Domains → Add Domain** → adicione seu domínio (ou use o sandbox para testes)
4. Adicione `RESEND_API_KEY` na Vercel

---

## PASSO 8 — Criar primeiro usuário admin

No Supabase → **SQL Editor**:

```sql
-- 1. Criar o usuário via Auth
-- Faça isso via /register no app com o email admin

-- 2. Após criar, promover para admin
UPDATE public.users
SET role = 'admin'
WHERE email = 'raphaellimaduarte@gmail.com';
```

---

## PASSO 9 — Gerar tipos TypeScript do banco

Depois de rodar as migrações:

```bash
# Requer supabase CLI linkado ao projeto
npm run db:types
```

Isso atualiza `src/types/supabase.ts` com os tipos reais do banco.

---

## Deploy automático (CI/CD)

A Vercel configura automaticamente:
- **Push para `main`** → deploy em produção
- **Pull Requests** → Preview Deployments com URL única

Para proteger `main`, configure no GitHub:
- **Settings → Branches → Branch protection rules**
- Require pull request reviews before merging

---

## Checklist pré-lançamento

- [ ] Migrações rodadas sem erros
- [ ] RLS habilitado em todas as tabelas
- [ ] Variáveis de ambiente na Vercel
- [ ] Auth URL configurada no Supabase
- [ ] Z-API conectada e webhook ativo
- [ ] Resend configurado
- [ ] Usuário admin criado
- [ ] Tipos TypeScript atualizados
- [ ] `npm run build` passa sem erros
- [ ] `npm run type-check` passa sem erros
- [ ] Login/logout funcionando
- [ ] Criação de OS funcionando
- [ ] Notificação WhatsApp chegando

---

## Comandos úteis no dia a dia

```bash
# Dev local
npm run dev

# Verificar TypeScript
npm run type-check

# Lint
npm run lint

# Regenerar tipos do Supabase
npm run db:types

# Rodar migrations localmente (Supabase CLI)
supabase db reset

# Ver logs da Vercel
vercel logs https://freela-app.vercel.app
```

---

## Estrutura de branches recomendada

```
main          ← produção (auto-deploy Vercel)
develop       ← staging / preview
feat/*        ← features
fix/*         ← bugfixes
```
