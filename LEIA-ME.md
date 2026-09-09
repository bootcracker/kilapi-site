# KILAPI — landing page

Página de apresentação do produto KILAPI. Ficheiro único, sem framework e sem passo
de build: `index.html` (CSS e JS embutidos) + `assets/img/`.

Hoje, `mayongi-ao.com/kilapi/` abre **directamente a aplicação**. Quem chega por um
link partilhado ou por pesquisa cai no ecrã de «Criar conta» sem perceber o que o
produto é. Esta página resolve isso.

## Estrutura
```
index.html                 a página toda
assets/img/ecra-*.png      capturas reais da demonstração da app (não são mockups)
assets/img/og-kilapi.png   imagem de partilha (WhatsApp, Facebook), 1200x630
assets/img/favicon.ico     ícones, copiados da própria app
assets/img/icone-*.png
```

## Ver localmente
```bash
python -m http.server 8974 --bind 127.0.0.1 --directory .
# abrir http://127.0.0.1:8974/
```
Os botões apontam para `app/`, que só existe depois de publicado (ver abaixo).

## Como publicar — o ponto que precisa de decisão

A página assume que passa a valer isto no servidor:

| URL | passa a ser |
|---|---|
| `mayongi-ao.com/kilapi/` | **esta landing** |
| `mayongi-ao.com/kilapi/app/` | a aplicação (o que hoje está em `/kilapi/`) |

Ou seja: mover o conteúdo actual de `public_html/kilapi/` para
`public_html/kilapi/app/` e pôr esta pasta na raiz de `/kilapi/`.

### Três cuidados antes de mexer

1. **Links de confirmação já enviados.** A app manda por WhatsApp links para
   `kilapi/confirmar.html?...` (válidos 72 h) e extractos para `kilapi/extracto.html?...`.
   Se a app mudar de pasta, esses links partem. **Solução:** deixar cópias de
   `confirmar.html`, `extracto.html` e `kilapi_api.php` também em `/kilapi/`, além
   das que vão para `/kilapi/app/`. Ao fim de 3 dias os links antigos expiram
   e as cópias podem sair.
2. **Quem já instalou a app** tem o atalho a apontar para `/kilapi/`. A landing
   já trata disso: se for aberta em modo aplicação (`display-mode: standalone`),
   reencaminha sozinha para `app/`. O utilizador não dá por nada.
3. **Service worker.** O `sw.js` da app tem âmbito relativo (`./`), por isso
   continua a funcionar dentro de `app/`. O antigo, registado no âmbito `/kilapi/`,
   pode servir a app em cache a quem já lá esteve — passa com o primeiro
   recarregamento, e o aviso de «Nova versão» da própria app trata do resto.

Se preferires não mexer na app, a alternativa é publicar a landing num caminho
novo (por exemplo `/kilapi-info/` ou um subdomínio) e apontar lá os links de
divulgação — mas aí quem escrever `mayongi-ao.com/kilapi` continua a cair na app.

Publica-se por SFTP (o shell do cPanel está desligado; ver
`sitemayongi/_docs/PENDENTES.md`).

## Conteúdo — de onde vem

Tudo o que a página afirma foi tirado da app que está em produção (v0.4):
confirmação por PIN sem rede, link de WhatsApp válido 72 h, «guardar sem
confirmação», contestação, alertas de 7/15/30 dias, troco e saldo a favor,
extracto e recibo por WhatsApp, funcionamento offline com sincronização,
instalação como PWA, 30 dias grátis no registo e renovação da assinatura pelo
WhatsApp +244 929 078 409.

**Não há preço na página** porque a app não publica nenhum — só fala em «30 dias
grátis» e manda renovar pelo WhatsApp. Quando houver tabela de preços, é a
secção `#preco` que muda.

As capturas foram tiradas do modo demonstração da app real, num viewport de
telemóvel, e não desenhadas à mão. Se a app mudar de aspecto, voltar a tirá-las.

## Depois de publicar
- Acrescentar `https://mayongi-ao.com/kilapi/` ao `sitemap.xml` do site principal.
- Testar a partilha no WhatsApp para ver a imagem `og-kilapi.png`.
