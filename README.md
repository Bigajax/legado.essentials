# LEGADO essentials

Vitrine digital e painel da LEGADO essentials, marca de camisetas básicas.
A venda acontece no WhatsApp: o site apresenta as peças, monta a mensagem já
preenchida e entrega o cliente na conversa. Não há carrinho, checkout, frete
nem conta de cliente, de propósito.

- **Stack**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind 4
- **Dados**: JSON em disco por padrão; o adaptador de Supabase entra sem tocar em página nenhuma
- **Deploy**: Vercel

## Rodando

```bash
npm install
cp .env.example .env.local   # preencha antes de subir
npm run dev
```

O site fica em `http://localhost:3000` e o painel em `/admin`.

Sem `.env.local` o projeto sobe assim mesmo, com valores de desenvolvimento
(inclusive uma senha padrão de painel). Isso é conveniência local, não é
configuração de produção.

## Variáveis

| Variável | Para que serve |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL canônica: sitemap, OpenGraph e o link que vai na mensagem do WhatsApp. Sem barra no fim. |
| `NEXT_PUBLIC_WHATSAPP_NUMERO` | Número que recebe os pedidos. Só dígitos: DDI + DDD + número. |
| `ADMIN_SENHA` | Senha única do painel. |
| `ADMIN_SEGREDO` | Chave que assina o cookie de sessão. Gere com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |

Todas passam por uma guarda contra valor vazio. Variável declarada em branco
na Vercel cai no padrão em vez de virar `""` silenciosamente, que é o que
quebrava o build em `new URL("")`.

## Como está organizado

```
app/(site)/          vitrine: home e /p/[slug]
app/admin/           painel protegido, com todas as server actions em acoes.ts
components/site/     hero, catálogo, cabeçalho, rodapé
components/admin/    lista de peças, modal, formulário
data/site.config.ts  textos e dados de marca, nunca hardcoded em página
data/seed.ts         semente do catálogo na primeira leitura
lib/repo/            contrato + adaptador local (e o de Supabase, quando entrar)
lib/whatsapp.ts      o único arquivo que conhece wa.me
```

### O catálogo é uma lista

O modelo é `Peca[]` desde o começo, mesmo com uma peça só no ar. A vitrine se
adapta sozinha: com uma peça, a home mostra a cartela de cores; da segunda em
diante, aquela mesma seção vira o catálogo e cada peça ganha página própria.
O hero sempre traz a peça marcada como destaque.

### Proteção do painel em três camadas

1. `proxy.ts` redireciona por presença de cookie. É conveniência, não é a proteção.
2. `app/admin/(painel)/layout.tsx` chama `protegerPagina()`.
3. Toda action de escrita começa com `exigirAdmin()`.

O cookie é assinado com HMAC-SHA256 e comparado com `timingSafeEqual`.

### Fotos

As fotos das cores são recortes com fundo removido, para pousarem sobre o
campo de cor do hero. O painel aceita upload: o navegador converte para WebP
e reduz para 1400px antes de enviar, e o campo de fundo é sugerido a partir
da própria imagem.

**Atenção ao subir para a Vercel**: `lib/upload.ts` grava em
`public/uploads/`, que é efêmero lá. Esse é o ponto único que troca pelo
Storage do Supabase quando a loja for para produção com cadastro pelo painel.

## Pendências do cliente

- **WhatsApp**: o perfil não publica telefone. Está como `5500000000000`.
- **Preço**: sem valor publicado. A vitrine mostra "Consulte" até o lojista preencher pelo painel.
