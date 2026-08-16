# Studio Vitória Vieira — PWA

Sistema de gestão de clientes, procedimentos e agenda visual, instalável direto no celular como app (sem loja de aplicativos).

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Gerar a versão de produção

```bash
npm run build
```

Isso cria a pasta `dist/` — é ela que vai para o servidor/host.

## Publicar de graça (escolha uma)

**Vercel**
1. Crie conta em vercel.com (pode entrar com GitHub)
2. Suba este projeto para um repositório no GitHub
3. Em "New Project", importe o repositório — a Vercel detecta o Vite sozinha
4. Deploy. Pronto: você recebe uma URL tipo `studio-vitoria-vieira.vercel.app`

**Netlify**
1. Crie conta em netlify.com
2. "Add new site" → "Deploy manually" → arraste a pasta `dist/` gerada pelo build
3. Pronto, recebe uma URL pública

## Instalar no celular (depois de publicado)

- **Android (Chrome)**: abrir o link → menu (⋮) → "Adicionar à tela inicial" / "Instalar app"
- **iPhone (Safari)**: abrir o link → ícone de compartilhar → "Adicionar à Tela de Início"

O ícone "Studio Vitória Vieira" aparece na tela inicial e abre em tela cheia, como um app nativo.

## Ir para a Google Play Store no futuro

Não precisa refazer nada. Quando quiserem:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npm run build
npx cap sync
npx cap open android
```

Isso abre o projeto no Android Studio já embrulhando este mesmo PWA, pronto para gerar o AAB assinado e publicar no Google Play Console.

## O que falta para uso real (fora do escopo deste protótipo)

- **Banco de dados em nuvem** (ex: Supabase ou Firebase) para a dona e as funcionárias verem a mesma agenda atualizada em tempo real — hoje os dados são de exemplo e ficam só na sessão do navegador.
- **Envio de WhatsApp**: os botões abrem o WhatsApp com a mensagem pronta (`wa.me`), mas quem envia é sempre uma pessoa — não há disparo automático.
