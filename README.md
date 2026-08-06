# DuoDent — site oficial

Site institucional da DuoDent Odontologia Especializada, preparado para
Cloudflare Workers com Vinext, React e TypeScript.

## Incluído no projeto

- código-fonte completo;
- vídeos, sequências de frames e imagens de pacientes;
- correções de animação, carregamento e rolagem para navegadores mobile;
- favicon oficial da DuoDent em SVG, PNG, ICO e Apple Touch Icon;
- configuração do Cloudflare em `wrangler.jsonc`;
- comandos de desenvolvimento, build e publicação.

## Requisitos

- Node.js 22.13 ou superior;
- uma conta Cloudflare;
- Git, apenas se a publicação for feita pelo GitHub.

## Testar no computador

```bash
npm install
npm run dev
```

## Publicar diretamente no Cloudflare

```bash
npm install
npx wrangler login
npm run deploy
```

Se a conta tiver mais de um Account ID, defina `CLOUDFLARE_ACCOUNT_ID` antes
da publicação.

## Publicar pelo GitHub + Cloudflare

1. Extraia o ZIP e envie todo o conteúdo da pasta para o repositório GitHub.
2. Na Cloudflare, abra **Workers & Pages** e importe o repositório.
3. Use estas configurações:

| Campo | Valor |
| --- | --- |
| Root directory | `/` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node.js | `22` ou superior |

Não envie manualmente `node_modules`, `dist`, `.wrangler`, `.sites-runtime` ou
arquivos `.env`. Esses itens são recriados durante o build.

## Comandos

```bash
npm run dev
npm run lint
npm run build
npm run deploy
npm run deploy:preview
```

## Domínio próprio

Depois da primeira publicação, abra o Worker na Cloudflare e acesse
**Settings > Domains & Routes > Add > Custom Domain**.
