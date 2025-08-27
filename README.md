# Chat AI

Uma aplicação de chat inteligente construída com Next.js, Tailwind CSS, DaisyUI, Supabase e OpenAI.

## Funcionalidades

- ✅ Autenticação segura com Supabase (email/senha)
- ✅ Interface moderna com Tailwind CSS e DaisyUI
- ✅ Chat integrado com OpenAI GPT-4o-mini
- ✅ Header com avatar do usuário e logout
- ✅ Animação de digitação durante respostas da IA
- ✅ Design responsivo e acessível

## Configuração

### 1. Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# OpenAI Configuration
OPENAI_API_KEY=sua_chave_da_openai
```

### 2. Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > API para obter sua URL e chave anônima
4. Configure a autenticação por email/senha em Authentication > Settings

### 3. Configuração da OpenAI

1. Crie uma conta na [OpenAI](https://platform.openai.com)
2. Gere uma API key em API Keys
3. Certifique-se de ter créditos disponíveis para usar o modelo GPT-4o-mini

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
