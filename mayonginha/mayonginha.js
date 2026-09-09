/* ==========================================================================
   Mayonginha — motor do assistente (versão portátil)

   NÃO é um modelo de linguagem. É um classificador por palavras-chave que
   corre inteiramente no navegador: sem servidor, sem chave de API, sem custo
   por pergunta e sem latência. Em páginas estáticas alojadas em cPanel, é a
   única forma de isto funcionar de verdade.

   A regra que a governa: quando não tem a certeza, NÃO inventa. Diz que não
   sabe e encaminha para a pessoa certa.

   Este ficheiro é IGUAL em todas as landing pages. O que muda de site para
   site vive no conhecimento.js ao lado, em window.MAYONGINHA:

     marca, titulo, estado, saudacao, nota      — identidade
     tema {primaria, escura, viva, fonte}       — cor, para casar com o site
     avatar                                     — SVG próprio (opcional)
     whatsapp {numero, texto}                   — botão verde flutuante
     rotas [{texto, href, externo}]             — para onde encaminhar
     sugestoes []                               — perguntas frequentes
     saber [{id, chaves[], resposta, accoes[]}] — a base de conhecimento

   O markup e o CSS são injectados por este ficheiro: a página só precisa das
   duas tags <script>. As classes têm prefixo mgz__ para não colidirem com o
   CSS de cada site.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.MAYONGINHA;
  if (!CFG || !CFG.saber || !CFG.saber.length) return;

  var TEMA     = CFG.tema || {};
  var PRIMARIA = TEMA.primaria || '#7C3AED';
  var ESCURA   = TEMA.escura   || '#4C1D95';
  var VIVA     = TEMA.viva     || '#8B5CF6';
  var FONTE    = TEMA.fonte    || 'inherit';
  var TITULO   = CFG.titulo || 'Mayonginha';
  var ESTADO   = CFG.estado || ('Assistente do ' + (CFG.marca || 'site'));
  var ROTAS    = CFG.rotas || [];

  /* --- Avatar -------------------------------------------------------------
     Embutido como data URI: um ficheiro a menos para copiar e nenhum caminho
     relativo para acertar em cada site. Um site com mascote própria define
     CFG.avatar com o seu SVG e usa esse em vez deste. */
  var SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
    '<defs>' +
    '<linearGradient id="f" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + VIVA + '"/><stop offset="1" stop-color="' + ESCURA + '"/>' +
    '</linearGradient>' +
    '<linearGradient id="p" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#8A5A3C"/><stop offset="1" stop-color="#6E452C"/>' +
    '</linearGradient>' +
    '<linearGradient id="b" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E8E8F2"/>' +
    '</linearGradient>' +
    '<clipPath id="r"><circle cx="60" cy="60" r="60"/></clipPath>' +
    '</defs>' +
    '<g clip-path="url(#r)">' +
    '<circle cx="60" cy="60" r="60" fill="url(#f)"/>' +
    '<path d="M18 120c0-20 19-31 42-31s42 11 42 31z" fill="url(#b)"/>' +
    '<path d="M52 90h16l-8 13z" fill="#F2F2F7"/>' +
    '<path d="M50 74h20v16a10 10 0 0 1-20 0z" fill="#6E452C"/>' +
    '<path d="M60 12c22 0 34 15 34 34 0 12-3 19-6 24 3-16-2-27-8-31-7 5-16 7-24 6-8-1-13 4-15 12-2-4-3-7-3-11 0-19 10-34 22-34z" fill="#241A2E"/>' +
    '<circle cx="60" cy="44" r="33" fill="#2C2036"/>' +
    '<circle cx="33" cy="48" r="13" fill="#241A2E"/>' +
    '<circle cx="87" cy="48" r="13" fill="#241A2E"/>' +
    '<circle cx="41" cy="30" r="12" fill="#2C2036"/>' +
    '<circle cx="79" cy="30" r="12" fill="#2C2036"/>' +
    '<ellipse cx="34" cy="60" rx="5" ry="7" fill="#6E452C"/>' +
    '<ellipse cx="86" cy="60" rx="5" ry="7" fill="#6E452C"/>' +
    '<circle cx="34" cy="69" r="3.4" fill="#E3C46A"/>' +
    '<circle cx="86" cy="69" r="3.4" fill="#E3C46A"/>' +
    '<path d="M60 26c15 0 25 11 25 27 0 18-11 30-25 30S35 71 35 53c0-16 10-27 25-27z" fill="url(#p)"/>' +
    '<path d="M36 47c2-13 11-21 24-21s22 8 24 21c-6-7-13-10-24-10s-18 3-24 10z" fill="#241A2E"/>' +
    '<path d="M45 50c3-2.6 8-2.6 11 0" fill="none" stroke="#241A2E" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M64 50c3-2.6 8-2.6 11 0" fill="none" stroke="#241A2E" stroke-width="2.6" stroke-linecap="round"/>' +
    '<ellipse cx="50.5" cy="58" rx="5.2" ry="4.4" fill="#FFFFFF"/>' +
    '<ellipse cx="69.5" cy="58" rx="5.2" ry="4.4" fill="#FFFFFF"/>' +
    '<circle cx="51.2" cy="58.4" r="2.7" fill="#241A2E"/>' +
    '<circle cx="70.2" cy="58.4" r="2.7" fill="#241A2E"/>' +
    '<circle cx="52.2" cy="57.4" r=".9" fill="#FFFFFF"/>' +
    '<circle cx="71.2" cy="57.4" r=".9" fill="#FFFFFF"/>' +
    '<path d="M44.6 55.4l-2.2-1.6M75.4 55.4l2.2-1.6" stroke="#241A2E" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M60 62.5c-1.6 2.2-1 3.6 0 3.8 1-.2 1.6-1.6 0-3.8z" fill="#5C3823"/>' +
    '<path d="M53 71c2.4 3.2 11.6 3.2 14 0" fill="none" stroke="#3A2417" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M54.6 71.6c2 2 8.8 2 10.8 0-1.6 2.6-9.2 2.6-10.8 0z" fill="#FFFFFF"/>' +
    '<ellipse cx="44" cy="66" rx="4" ry="2.6" fill="#B4685A" opacity=".38"/>' +
    '<ellipse cx="76" cy="66" rx="4" ry="2.6" fill="#B4685A" opacity=".38"/>' +
    '</g></svg>';

  var AVATAR = 'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(typeof CFG.avatar === 'string' && CFG.avatar ? CFG.avatar : SVG);

  /* --- Estilos ------------------------------------------------------------
     Injectados aqui para o widget não depender do CSS de cada site. Só a cor
     e a fonte vêm de fora, para casar com a página onde está. */
  var CSS = [
    '.mgz__flut{position:fixed;right:16px;bottom:16px;z-index:9990;display:flex;align-items:center;gap:12px;font-family:' + FONTE + '}',
    '.mgz__abrir{position:relative;width:56px;height:56px;padding:0;border:0;border-radius:50%;cursor:pointer;',
      'background:linear-gradient(135deg,' + PRIMARIA + ' 0%,' + VIVA + ' 100%);box-shadow:0 8px 24px rgba(0,0,0,.28);',
      'transition:transform .22s ease,box-shadow .22s ease}',
    '.mgz__abrir:hover{transform:scale(1.07);box-shadow:0 12px 30px rgba(0,0,0,.34)}',
    '.mgz__abrir img{width:100%;height:100%;border-radius:50%;display:block}',
    '.mgz__abrir::after{content:"";position:absolute;right:2px;bottom:2px;width:13px;height:13px;border-radius:50%;background:#22C55E;border:2.5px solid #fff}',
    '.mgz__rotulo{position:absolute;right:calc(100% + 10px);top:50%;transform:translateY(-50%);padding:7px 14px;border-radius:999px;',
      'background:#12161F;color:#fff;font-weight:600;font-size:12px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .22s ease}',
    '@media (hover:hover){.mgz__abrir:hover .mgz__rotulo,.mgz__abrir:focus-visible .mgz__rotulo{opacity:1}}',
    '.mgz__zap{width:56px;height:56px;flex:none;display:grid;place-items:center;background:#25D366;color:#0B3D22;',
      'border-radius:50%;box-shadow:0 8px 24px rgba(0,0,0,.3);transition:transform .22s ease}',
    '.mgz__zap:hover{transform:scale(1.07)}',
    '.mgz__zap svg{width:28px;height:28px}',
    '.mgz{position:fixed;z-index:9995;right:16px;bottom:88px;width:min(calc(100vw - 2rem),380px);max-height:min(74vh,620px);',
      'display:flex;flex-direction:column;background:#fff;border-radius:18px;box-shadow:0 28px 70px rgba(18,22,31,.34);overflow:hidden;',
      'font-family:' + FONTE + ';color:#12161F;opacity:0;visibility:hidden;transform:translateY(10px) scale(.98);transform-origin:bottom right;',
      'transition:opacity .22s ease,transform .22s ease,visibility .22s ease}',
    '.mgz[data-aberto="sim"]{opacity:1;visibility:visible;transform:none}',
    '.mgz__topo{display:flex;align-items:center;gap:12px;padding:16px 20px;background:linear-gradient(135deg,' + PRIMARIA + ' 0%,' + ESCURA + ' 100%);color:#fff}',
    '.mgz__avatar{width:40px;height:40px;flex:none;border-radius:50%}',
    '.mgz__titulo{font-weight:700;font-size:1rem;line-height:1.2}',
    '.mgz__estado{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:rgba(255,255,255,.78)}',
    '.mgz__estado::before{content:"";width:7px;height:7px;border-radius:50%;background:#4ADE80}',
    '.mgz__fechar{margin-left:auto;width:36px;height:36px;flex:none;display:grid;place-items:center;border-radius:50%;background:transparent;border:0;cursor:pointer;color:#fff}',
    '.mgz__fechar:hover{background:rgba(255,255,255,.16)}',
    '.mgz__fechar svg{width:18px;height:18px}',
    '.mgz__conversa{flex:1;overflow-y:auto;padding:20px;display:grid;gap:16px;background:#F7F7FA}',
    '.mgz__linha{display:flex;align-items:flex-end;gap:8px;max-width:92%}',
    '.mgz__linha--pessoa{margin-left:auto;justify-content:flex-end}',
    '.mgz__mini{width:28px;height:28px;flex:none;border-radius:50%}',
    '.mgz__balao{min-width:0}',
    '.mgz__texto{padding:12px 14px;border-radius:14px;font-size:.875rem;line-height:1.55}',
    '.mgz__linha--bot .mgz__texto{background:#fff;color:#12161F;border-bottom-left-radius:4px;box-shadow:0 1px 2px rgba(18,22,31,.08),0 6px 18px -10px rgba(18,22,31,.25)}',
    '.mgz__linha--pessoa .mgz__texto{background:' + PRIMARIA + ';color:#fff;border-bottom-right-radius:4px}',
    '.mgz__pensa{display:flex;gap:4px;align-items:center}',
    '.mgz__pensa i{width:6px;height:6px;border-radius:50%;background:#8B93A3;animation:mgz-pisca 1.1s infinite ease-in-out}',
    '.mgz__pensa i:nth-child(2){animation-delay:.16s}',
    '.mgz__pensa i:nth-child(3){animation-delay:.32s}',
    '@keyframes mgz-pisca{0%,80%,100%{opacity:.28}40%{opacity:1}}',
    '.mgz__accoes{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}',
    '.mgz__accao{display:inline-block;padding:6px 12px;border:1.5px solid ' + VIVA + ';border-radius:999px;background:#fff;color:' + PRIMARIA + ';',
      'font-weight:600;font-size:12px;text-decoration:none;transition:border-color .22s ease,background .22s ease}',
    '.mgz__accao:hover{border-color:' + PRIMARIA + ';background:rgba(0,0,0,.03)}',
    '.mgz__chips{display:flex;flex-wrap:wrap;gap:8px;padding:16px 20px;background:#F7F7FA;flex:none;height:168px;overflow-y:auto;',
      'border-top:1px solid #E4E4EC;overscroll-behavior:contain}',
    '.mgz__chips[hidden]{display:none}',
    '.mgz__chips::-webkit-scrollbar{width:6px}',
    '.mgz__chips::-webkit-scrollbar-thumb{background:#E4E4EC;border-radius:999px}',
    '.mgz__chip{padding:7px 12px;border:1.5px solid #E4E4EC;border-radius:999px;background:#fff;color:#5B6270;cursor:pointer;',
      'font-family:inherit;font-size:12px;line-height:1.3;transition:border-color .22s ease,color .22s ease}',
    '.mgz__chip:hover{border-color:' + VIVA + ';color:' + PRIMARIA + '}',
    '.mgz__forma{display:flex;align-items:center;gap:8px;padding:16px 20px;background:#F7F7FA;border-top:1px solid #E4E4EC}',
    '.mgz__faq{width:40px;height:40px;flex:none;display:grid;place-items:center;border:1.5px solid #E4E4EC;border-radius:50%;background:#fff;color:#5B6270;cursor:pointer}',
    '.mgz__faq:hover{border-color:' + VIVA + ';color:' + PRIMARIA + '}',
    '.mgz__faq svg{width:18px;height:18px}',
    '.mgz__campo{flex:1;min-width:0;min-height:44px;padding:0 16px;border:1.5px solid #E4E4EC;border-radius:999px;background:#fff;color:#12161F;font-family:inherit;font-size:.875rem}',
    '.mgz__campo:focus{border-color:' + VIVA + ';outline:none}',
    '.mgz__enviar{width:44px;height:44px;flex:none;display:grid;place-items:center;border:0;border-radius:50%;cursor:pointer;',
      'background:linear-gradient(135deg,' + PRIMARIA + ' 0%,' + VIVA + ' 100%);color:#fff}',
    '.mgz__enviar svg{width:19px;height:19px}',
    '.mgz__nota{margin:0;padding:0 20px 16px;background:#F7F7FA;font-size:11px;color:#5B6270;line-height:1.45}',
    '.mgz__so-leitor{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}',
    '@media (max-width:560px){.mgz__flut{right:14px;bottom:14px;gap:10px}.mgz__abrir,.mgz__zap{width:50px;height:50px}.mgz{right:14px;bottom:76px}}',
    '@media (prefers-reduced-motion:reduce){.mgz__pensa i{animation:none;opacity:.6}.mgz__abrir:hover,.mgz__zap:hover{transform:none}}'
  ].join('');

  /* --- Classificação ------------------------------------------------------
     Sem normalizar, "certificação" e "certificacao" seriam perguntas
     diferentes. Chaves mais longas pesam mais, para "inteligencia
     artificial" ganhar a "ia". */
  function normalizar(t) {
    return (t || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9+&\s]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  function escolher(pergunta) {
    var p = ' ' + normalizar(pergunta) + ' ';
    var melhor = null, melhorPeso = 0;
    CFG.saber.forEach(function (item) {
      var peso = 0;
      item.chaves.forEach(function (chave) {
        var c = normalizar(chave);
        if (!c) return;
        if (p.indexOf(' ' + c + ' ') !== -1) peso += c.length + 4;
        else if (c.length >= 4 && p.indexOf(c) !== -1) peso += c.length;
      });
      if (peso > melhorPeso) { melhorPeso = peso; melhor = item; }
    });
    return melhorPeso >= 6 ? melhor : null;
  }

  /* --- Markup ------------------------------------------------------------- */
  var estilo = document.createElement('style');
  estilo.textContent = CSS;
  document.head.appendChild(estilo);

  var ZAP_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.07-.13-.27-.2-.57-.35z"/>' +
    '<path d="M12.04 2C6.6 2 2.17 6.43 2.17 11.87c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.83 9.83 0 004.7 1.2h.01c5.44 0 9.87-4.43 9.87-9.87 0-2.64-1.03-5.12-2.9-6.98A9.8 9.8 0 0012.04 2zm0 18.05h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.16 8.16 0 01-1.25-4.36c0-4.52 3.68-8.2 8.21-8.2a8.15 8.15 0 015.8 2.41 8.15 8.15 0 012.4 5.8c0 4.53-3.68 8.2-8.2 8.2z"/></svg>';

  var zapHtml = '';
  if (CFG.whatsapp && CFG.whatsapp.numero) {
    zapHtml =
      '<a class="mgz__zap" href="https://wa.me/' + CFG.whatsapp.numero + '?text=' +
      encodeURIComponent(CFG.whatsapp.texto || 'Olá!') + '" target="_blank" rel="noopener" ' +
      'aria-label="Falar connosco por WhatsApp">' + ZAP_SVG + '</a>';
  }

  var flut = document.createElement('div');
  flut.className = 'mgz__flut';
  flut.innerHTML =
    '<button class="mgz__abrir" type="button" aria-expanded="false" aria-controls="mgz-painel">' +
      '<img src="' + AVATAR + '" alt="" width="56" height="56">' +
      '<span class="mgz__rotulo" aria-hidden="true">Falar com a ' + TITULO + '</span>' +
      '<span class="mgz__so-leitor">Abrir a ' + TITULO + ', assistente' +
        (CFG.marca ? ' do ' + CFG.marca : '') + '</span>' +
    '</button>' + zapHtml;
  document.body.appendChild(flut);

  var painel = document.createElement('div');
  painel.className = 'mgz';
  painel.id = 'mgz-painel';
  painel.setAttribute('data-aberto', 'nao');
  painel.setAttribute('role', 'dialog');
  painel.setAttribute('aria-modal', 'false');
  painel.setAttribute('aria-label', TITULO + ', ' + ESTADO);
  painel.innerHTML =
    '<div class="mgz__topo">' +
      '<img class="mgz__avatar" src="' + AVATAR + '" alt="" width="40" height="40">' +
      '<span><span class="mgz__titulo">' + TITULO + '</span><br>' +
      '<span class="mgz__estado">' + ESTADO + '</span></span>' +
      '<button class="mgz__fechar" type="button">' +
        '<span class="mgz__so-leitor">Fechar a ' + TITULO + '</span>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">' +
        '<path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="mgz__conversa" aria-live="polite"></div>' +
    '<div class="mgz__chips" hidden></div>' +
    '<form class="mgz__forma">' +
      '<button class="mgz__faq" type="button" aria-expanded="false">' +
        '<span class="mgz__so-leitor">Ver perguntas frequentes</span>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 114.1 2.2c-.9.7-1.7 1.1-1.7 2.2M12 17h.01"/></svg>' +
      '</button>' +
      '<label class="mgz__so-leitor" for="mgz-campo">Escreva a sua pergunta</label>' +
      '<input class="mgz__campo" id="mgz-campo" type="text" autocomplete="off" placeholder="Escreva a sua pergunta…">' +
      '<button class="mgz__enviar" type="submit">' +
        '<span class="mgz__so-leitor">Enviar pergunta</span>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 12h15M13 6l6 6-6 6"/></svg>' +
      '</button>' +
    '</form>' +
    '<p class="mgz__nota">' + (CFG.nota ||
      'Respostas automáticas às perguntas mais comuns. Para um caso concreto, a ' + TITULO +
      ' encaminha-o para a pessoa certa.') + '</p>';
  document.body.appendChild(painel);

  /* --- Interface ---------------------------------------------------------- */
  var abrir    = flut.querySelector('.mgz__abrir');
  var fechar   = painel.querySelector('.mgz__fechar');
  var conversa = painel.querySelector('.mgz__conversa');
  var chips    = painel.querySelector('.mgz__chips');
  var verFaq   = painel.querySelector('.mgz__faq');
  var forma    = painel.querySelector('.mgz__forma');
  var campo    = painel.querySelector('.mgz__campo');

  var trocas = 0;
  var jaEncaminhou = false;

  function balao(quem, html, accoes) {
    var linha = document.createElement('div');
    linha.className = 'mgz__linha mgz__linha--' + quem;

    if (quem === 'bot') {
      var av = document.createElement('img');
      av.className = 'mgz__mini'; av.src = AVATAR; av.alt = '';
      av.width = 28; av.height = 28;
      linha.appendChild(av);
    }

    var d = document.createElement('div');
    d.className = 'mgz__balao';

    var t = document.createElement('div');
    t.className = 'mgz__texto';
    t.innerHTML = html;
    d.appendChild(t);

    if (accoes && accoes.length) {
      var g = document.createElement('div');
      g.className = 'mgz__accoes';
      accoes.forEach(function (a) {
        var l = document.createElement('a');
        l.className = 'mgz__accao';
        l.href = a.href; l.textContent = a.texto;
        if (a.externo) { l.target = '_blank'; l.rel = 'noopener'; }
        else if (a.href.charAt(0) === '#') {
          l.addEventListener('click', function () { estado(false); });
        }
        g.appendChild(l);
      });
      d.appendChild(g);
    }

    linha.appendChild(d);
    conversa.appendChild(linha);
    conversa.scrollTop = conversa.scrollHeight;
  }

  /* pequeno atraso com indicador: sem isto a resposta aparece antes de a
     pergunta ser lida, e o diálogo deixa de se ler como diálogo */
  function aPensar(depois) {
    var linha = document.createElement('div');
    linha.className = 'mgz__linha mgz__linha--bot';
    linha.innerHTML = '<img class="mgz__mini" src="' + AVATAR + '" alt="" width="28" height="28">' +
      '<div class="mgz__balao"><div class="mgz__texto mgz__pensa"><i></i><i></i><i></i></div></div>';
    conversa.appendChild(linha);
    conversa.scrollTop = conversa.scrollHeight;
    setTimeout(function () { linha.remove(); depois(); }, 480);
  }

  function perguntar(texto) {
    if (!texto || !texto.trim()) return;
    balao('pessoa', texto.replace(/</g, '&lt;'));
    trocas++;

    aPensar(function () {
      var achado = escolher(texto);
      if (achado) {
        balao('bot', achado.resposta, achado.accoes);
        if (achado.id === 'falar') jaEncaminhou = true;
      } else {
        balao('bot',
          'Essa não sei responder com segurança, e prefiro não inventar. '
          + 'Passo-o a quem sabe:', ROTAS);
        jaEncaminhou = true;
      }

      // depois de algumas trocas, ela própria oferece o passo seguinte
      if (!jaEncaminhou && trocas === 3) {
        setTimeout(function () {
          balao('bot', 'Já agora: quer que o ponha em contacto com alguém da equipa?', ROTAS);
          jaEncaminhou = true;
        }, 700);
      }
    });
  }

  function estado(aberto) {
    painel.setAttribute('data-aberto', aberto ? 'sim' : 'nao');
    abrir.setAttribute('aria-expanded', String(aberto));
    if (aberto) campo.focus();
    else abrir.focus();
  }

  /* as sugestões ficam ocultas: só aparecem se as pedirem */
  (CFG.sugestoes || []).forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'mgz__chip'; b.textContent = s;
    b.addEventListener('click', function () {
      perguntar(s);
      chips.hidden = true;
      verFaq.setAttribute('aria-expanded', 'false');
    });
    chips.appendChild(b);
  });

  verFaq.addEventListener('click', function () {
    var mostrar = chips.hidden;
    chips.hidden = !mostrar;
    verFaq.setAttribute('aria-expanded', String(mostrar));
  });

  balao('bot', CFG.saudacao ||
    ('Olá! Sou a <strong>' + TITULO + '</strong>. Pergunte-me o que quiser. '
     + 'Se preferir falar com uma pessoa, também o encaminho.'));

  abrir.addEventListener('click', function () {
    estado(painel.getAttribute('data-aberto') !== 'sim');
  });
  fechar.addEventListener('click', function () { estado(false); });

  forma.addEventListener('submit', function (e) {
    e.preventDefault();
    perguntar(campo.value);
    campo.value = '';
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && painel.getAttribute('data-aberto') === 'sim') estado(false);
  });

  painel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = painel.querySelectorAll('a[href], button:not([disabled]), input');
    if (!f.length) return;
    var primeiro = f[0], ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  });
})();
