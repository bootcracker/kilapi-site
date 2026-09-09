/* ==========================================================================
   Mayonginha — conhecimento do KILAPI

   Tudo o que está aqui vem do que esta página afirma e é verificável. O único
   número que a página dá é o dos 30 dias grátis; o valor da assinatura fala-se
   pelo WhatsApp, e é isso que ela diz.

   O tratamento aqui é por «tu», como no resto do site do KILAPI.
   ========================================================================== */
(function () {
'use strict';

function zap(texto) {
  return 'https://wa.me/244929078409?text=' + encodeURIComponent(texto);
}

var ROTAS = [
  { texto: 'Falar por WhatsApp', href: zap('Olá! Tenho uma dúvida sobre o KILAPI.'), externo: true },
  { texto: 'Saber o preço', href: zap('Olá! Quero saber o preço do KILAPI.'), externo: true },
  { texto: 'Ligar +244 929 078 409', href: 'tel:+244929078409' }
];

window.MAYONGINHA = {
  marca:  'KILAPI',
  titulo: 'Mayonginha',
  estado: 'Assistente do KILAPI',

  /* verde do KILAPI, herdado do :root da própria página */
  tema: { primaria: '#166F3E', escura: '#0C4527', viva: '#1B8A4C' },

  whatsapp: {
    numero: '244929078409',
    texto:  'Olá! Quero saber mais sobre o KILAPI.'
  },

  saudacao:
    'Olá! Sou a <strong>Mayonginha</strong>, assistente do <strong>KILAPI</strong>. '
    + 'Pergunta-me como se regista um kilapi, como o cliente confirma ou o que acontece '
    + 'quando não há rede. Se preferires falar com uma pessoa, também te encaminho.',

  nota:
    'Respostas automáticas às perguntas mais comuns sobre o KILAPI. Para o teu caso, '
    + 'a Mayonginha encaminha-te para a equipa.',

  rotas: ROTAS,

  sugestoes: [
    'O que é o KILAPI?',
    'Como é que o cliente confirma?',
    'Funciona sem internet?',
    'O meu cliente precisa de telemóvel bom?',
    'E se eu perder o telemóvel?',
    'O cliente pode dizer que não é verdade?',
    'Quanto custa?',
    'Preciso de criar conta?',
    'Quero falar com alguém'
  ],

  saber: [
    { id: 'saudacao',
      chaves: ['ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'tudo bem', 'como esta'],
      resposta: 'Olá! Em que posso ajudar? Podes perguntar-me como funciona o registo, a confirmação '
              + 'do cliente ou o que a app faz sem rede.' },

    { id: 'quem-es',
      chaves: ['quem es', 'quem e voce', 'teu nome', 'como te chamas', 'es humana', 'es um robo',
               'es real', 'mayonginha'],
      resposta: 'Sou a <strong>Mayonginha</strong>, a assistente do KILAPI. Não sou uma pessoa: '
              + 'respondo às perguntas mais frequentes e, quando não sei, passo-te a quem sabe.' },

    { id: 'obrigado',
      chaves: ['obrigado', 'obrigada', 'valeu', 'perfeito', 'boa'],
      resposta: 'De nada! Se precisares de mais alguma coisa, é só dizer.' },

    { id: 'despedida',
      chaves: ['adeus', 'ate logo', 'tchau', 'ate breve'],
      resposta: 'Até breve! Fico por aqui se precisares.' },

    { id: 'falar',
      chaves: ['falar com alguem', 'falar com uma pessoa', 'atendimento', 'humano', 'operador',
               'comercial', 'contactar', 'telefonar', 'contacto', 'telefone', 'email', 'whatsapp'],
      resposta: 'Com certeza. Falamos pelo WhatsApp <strong>+244 929 078 409</strong>.',
      accoes: ROTAS },

    { id: 'produto',
      chaves: ['kilapi', 'o que e', 'para que serve', 'app', 'aplicacao', 'produto', 'resumo',
               'fiado', 'caderno', 'divida', 'credito'],
      resposta: 'O <strong>KILAPI</strong> é o caderno do fiado no telemóvel. Registas o que o cliente '
              + 'levou, ele confirma ali mesmo, e a dívida fica <strong>provada dos dois lados</strong>. '
              + 'No fim do mês não há discussão: está assinado.',
      accoes: [ { texto: 'Ver como funciona', href: '#como-funciona' } ] },

    { id: 'problema',
      chaves: ['porque', 'problema', 'caderno perde', 'eu paguei', 'nao pagaste', 'discussao',
               'prova', 'contesta'],
      resposta: 'O problema nunca foi vender fiado — é provar, três semanas depois, o que ficou por '
              + 'pagar. O caderno molha-se e perde-se, está escrito só de um lado e somar página a '
              + 'página fica sempre para depois. O KILAPI resolve as três coisas.',
      accoes: [ { texto: 'Ver como funciona', href: '#como-funciona' } ] },

    { id: 'passos',
      chaves: ['como funciona', 'como se usa', 'passos', 'registar', 'registo', 'lancar', 'como se lanca'],
      resposta: 'Três toques: <strong>1)</strong> escolhes o cliente, marcas o valor no teclado grande '
              + 'e escreves o que ele levou; <strong>2)</strong> o cliente confirma, com o PIN dele no '
              + 'teu telemóvel ou por um link no WhatsApp; <strong>3)</strong> o movimento passa a '
              + '✓✓ confirmado pelas duas partes no historial.',
      accoes: [ { texto: 'Ver os três passos', href: '#como-funciona' } ] },

    { id: 'confirmacao',
      chaves: ['confirmar', 'confirma', 'confirmacao', 'pin', 'link', 'assinar', 'assinatura',
               'como o cliente aceita', 'aceita', 'prova dos dois lados'],
      resposta: 'Há duas formas, e as duas deixam o mesmo registo. <strong>PIN do cliente</strong>: '
              + 'passas-lhe o telemóvel, ele marca o PIN que criou da primeira vez, o ecrã fica escuro '
              + 'e é dele naquele momento — e funciona sem rede. <strong>Link no WhatsApp</strong>: ele '
              + 'recebe, abre e confirma onde estiver; o link é válido por 72 horas e precisa de rede.',
      accoes: [ { texto: 'Ver as duas formas', href: '#como-funciona' } ] },

    { id: 'contestar',
      chaves: ['contestar', 'nao concorda', 'diz que nao', 'discordar', 'aguarda confirmacao', 'recusa',
               'nao e verdade', 'verdade', 'mentir', 'mentira', 'negar'],
      resposta: 'Pode contestar — e é para isso que a app serve. A resposta fica registada. Enquanto '
              + 'não responder, o valor aparece à parte, como <strong>«aguarda confirmação»</strong>, e '
              + 'não se mistura com o que já está fechado.' },

    { id: 'telemovel-cliente',
      chaves: ['telemovel do cliente', 'telemovel bom', 'smartphone', 'cliente sem telemovel',
               'precisa de telemovel'],
      resposta: 'Não precisa. A confirmação por PIN é marcada <strong>no teu telemóvel</strong> — '
              + 'passas-lhe o aparelho e ele mete quatro dígitos. Só precisas do WhatsApp dele se '
              + 'quiseres mandar o link de confirmação, o extracto ou o recibo.' },

    { id: 'offline',
      chaves: ['offline', 'sem internet', 'sem rede', 'internet', 'saldo de net', 'dados moveis',
               'sincroniza', 'sincronizacao'],
      resposta: 'Para registar um kilapi, receber um pagamento e confirmar com o PIN do cliente, '
              + '<strong>não precisas de rede</strong>. Fica tudo guardado no telemóvel e sobe sozinho '
              + 'quando a rede voltar. Precisas de rede para enviar links e recibos, e para sincronizar.' },

    { id: 'perder-telemovel',
      chaves: ['perder o telemovel', 'perdi o telemovel', 'roubado', 'trocar de telemovel',
               'outro aparelho', 'backup'],
      resposta: 'Entras noutro aparelho com o teu número e o teu PIN, e os dados voltam por '
              + 'sincronização. É por isso que vale a pena criar conta em vez de ficar na demonstração '
              + '— em modo demonstração os dados existem só naquele telemóvel.' },

    { id: 'funcoes',
      chaves: ['funcoes', 'o que faz', 'total a receber', 'alertas', 'cobranca', 'troco', 'saldo a favor',
               'extracto', 'recibo', 'conta corrente'],
      resposta: 'Dentro da app tens o <strong>total a receber</strong> sempre à vista (com o que '
              + 'aguarda confirmação contado à parte), <strong>alertas de cobrança</strong> aos 7, 15 ou '
              + '30 dias, <strong>troco ou saldo a favor</strong> quando o cliente paga acima da dívida, '
              + 'e <strong>extracto e recibo por WhatsApp</strong> em dois toques.' },

    { id: 'instalar',
      chaves: ['instalar', 'play store', 'loja de apps', 'app store', 'descarregar', 'download',
               'ocupa espaco'],
      resposta: 'Instala-se como aplicação: fica com <strong>ícone no telemóvel</strong>, sem passar '
              + 'por loja de apps e sem ocupar espaço.' },

    { id: 'para-quem',
      chaves: ['para quem', 'serve para', 'cantina', 'mercearia', 'quiosque', 'salao', 'borracharia',
               'padaria', 'talho', 'farmacia', 'gas', 'costureira', 'distribuidor', 'negocio'],
      resposta: 'Para quem vende a quem conhece: cantinas, mercearias, quiosques, salões de beleza, '
              + 'borracharias, oficinas, padarias, talhos e peixarias, farmácias de bairro, revenda de '
              + 'gás, costureiras e distribuidores com rota fixa.',
      accoes: [ { texto: 'Ver para quem é', href: '#como-funciona' } ] },

    { id: 'preco',
      chaves: ['preco', 'precos', 'custa', 'custo', 'quanto', 'valor', 'mensalidade', 'assinatura',
               'pagar', 'gratis', '30 dias', 'experimentar'],
      resposta: 'Experimentas <strong>30 dias grátis, com todas as funções</strong> — sem cartão e sem '
              + 'compromisso, crias a conta com o teu número de telefone e um PIN. Passado o mês, '
              + 'falamos pelo WhatsApp e activamos a assinatura do teu negócio. Mesmo sem assinatura '
              + 'activa, continuas a consultar tudo o que registaste.',
      accoes: [ { texto: 'Ver o preço', href: '#preco' },
                { texto: 'Saber o valor', href: zap('Olá! Quero saber o preço do KILAPI.'), externo: true } ] },

    { id: 'conta',
      chaves: ['criar conta', 'registar conta', 'demonstracao', 'sem conta', 'demo', 'experimentar sem conta'],
      resposta: 'Podes espreitar já a app em <strong>modo demonstração</strong>, sem sequer criar conta. '
              + 'Para trabalhar a sério, crias conta com o número de telefone e um PIN — é o que garante '
              + 'que os dados voltam se mudares de telemóvel.' },

    { id: 'factura',
      chaves: ['factura', 'fatura', 'agt', 'fiscal', 'saft', 'substitui a factura', 'imposto'],
      resposta: 'O KILAPI é o registo do fiado entre ti e o teu cliente — não é um sistema de '
              + 'facturação certificada. Se precisas de facturar, o melhor é falarmos: temos o '
              + 'BUESIMPLES para isso.',
      accoes: [ { texto: 'Falar connosco', href: zap('Olá! Preciso de facturação, não só do KILAPI.'), externo: true } ] },

    { id: 'suporte',
      chaves: ['suporte', 'ajuda', 'assistencia', 'problema', 'erro', 'nao funciona', 'bug', 'lento'],
      resposta: 'Lamento o transtorno. Fala connosco pelo WhatsApp <strong>+244 929 078 409</strong> e '
              + 'tratamos disso.',
      accoes: [ { texto: 'Falar por WhatsApp', href: zap('Olá! Tenho um problema no KILAPI.'), externo: true } ] },

    { id: 'empresa',
      chaves: ['mayongi', 'quem faz', 'quem desenvolve', 'a empresa', 'sobre voces', 'fabricante',
               'angola'],
      resposta: 'O KILAPI é feito em Angola pela <strong>Mayongi Angola</strong>, empresa de tecnologia '
              + 'sediada em Luanda.' }
  ]
};
})();
