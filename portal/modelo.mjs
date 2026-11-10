// As páginas do portal do NeuroDados Brasil, no desenho do site da T&D Sustentável
// (cabeçalho translúcido, trilha, abertura, faixas, cartões, botões em pílula e
// rodapé em colunas), com as cores da Clínica NeuroBee (no estilo.css). Todo texto vem de textos.mjs, dos metadados das bases ou dos
// registros; aqui só se monta o HTML.

import {
  MARCA, AVISO, PULAR, MENU_ROTULO, MENU, RODAPE, TEMA, CATEGORIAS, RELACOES, REGISTRO, PAGINAS,
  FERRAMENTAS_MCP, ROTULOS, TEMAS, CONDICOES, AREAS, REGULACAO,
} from './textos.mjs';

export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Preenche {chave}. Em fmtHtml o modelo é escapado e os valores entram como HTML.
export function fmt(modelo, vars = {}) {
  return modelo.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}
function fmtHtml(modelo, vars = {}) {
  return esc(modelo).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export function porExtenso(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

// A marca do NeuroDados: o hexágono de dados. As cores vêm do CSS (.nd-a, .nd-o).
const ICONE = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path class="nd-a" d="M32 4 56 18v28L32 60 8 46V18Z" stroke-width="4" stroke-linejoin="round"/><path class="nd-o" d="M22 24 32 32 42 24M32 32v12" stroke-width="3" stroke-linecap="round" fill="none"/><circle class="nd-of" cx="22" cy="24" r="4.5"/><circle class="nd-of" cx="42" cy="24" r="4.5"/><circle class="nd-of" cx="32" cy="44" r="4.5"/><circle class="nd-af" cx="32" cy="32" r="5.5"/></svg>';

// Os ícones do seletor de tema (sol, lua e tela), os mesmos do site da T&D.
const ICONES_TEMA = {
  claro: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M4.2 12H2M22 12h-2.2M5.6 5.6 4 4M20 20l-1.6-1.6M18.4 5.6 20 4M4 20l1.6-1.6"/></g></svg>',
  escuro: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" fill="currentColor"/></svg>',
  sistema: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M8 20.5h8"/></svg>',
};

function jsonLd(dados) {
  return `<script type="application/ld+json">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>`;
}

// O rótulo do menu para um caminho ("/sobre" vira "Sobre"), para a trilha.
const rotuloDoMenu = (caminho) => (MENU.find(([, c]) => c === caminho) || [])[0];

// A trilha: [[rótulo, caminho ou null], ...]; o último item é a página atual.
function trilhaHtml(ctx, itens) {
  if (!itens || itens.length < 2) return '';
  const li = itens.map(([rotulo, destino], i) => (i < itens.length - 1 && destino != null
    ? `<li><a href="${destino.startsWith('http') ? destino : ctx.prefixo + destino}">${esc(rotulo)}</a></li>`
    : `<li><span aria-current="page">${esc(rotulo)}</span></li>`)).join('');
  return `<div class="trilha"><div class="container"><ol>${li}</ol></div></div>`;
}
// A trilha das páginas de texto: NeuroDados › página.
const trilhaSimples = (caminho, rotulo) => [[REGISTRO.migalha[0], ''], [rotuloDoMenu(caminho) || rotulo, null]];

// ctx: { prefixo, urlBase, origem, cssV, medicaoV, temaV, previa, ga4, clarity, privacidade, email,
//        mantenedorUrl, mantenedorId, github, bases: [{ nome, url }] }
export function pagina(ctx, { caminho, titulo, descricao, corpo, grafo = [], extraHead = '', trilha = null }) {
  const url = ctx.urlBase + caminho;
  const atual = (c) => (c === '' ? caminho === '' : caminho === c || caminho.startsWith(c + '/'));
  const menu = MENU.map(([rotulo, c]) => `<li><a href="${ctx.prefixo}${c}"${atual(c) ? ' aria-current="page"' : ''}>${esc(rotulo)}</a></li>`).join('');
  const seletorTema = `<div class="tema" role="group" aria-label="${esc(TEMA.grupo)}">${['claro', 'escuro', 'sistema'].map((t) => `<button type="button" class="tema__op" data-tema-opcao="${t}" aria-pressed="false" title="${esc(TEMA[t])}">${ICONES_TEMA[t]}<span class="visualmente-oculto">${esc(TEMA[t])}</span></button>`).join('')}</div>`;

  // O rodapé em colunas, como o da T&D: a marca, as bases, o projeto e a documentação.
  const D = PAGINAS.documentacao;
  const link = (rotulo, destino) => `<li><a href="${destino.startsWith('http') ? destino : ctx.prefixo + destino}">${esc(rotulo)}</a></li>`;
  const doMenu = (c) => [rotuloDoMenu(c), c];
  const doRodape = (c) => RODAPE.links.find(([, d]) => d === c);
  const colunaBases = (ctx.bases || []).map((b) => link(b.nome, b.url)).join('');
  const colunaProjeto = [doMenu('/sobre'), doMenu('/governanca'), doMenu('/metodologia'), doRodape('/contribuicoes'), doRodape('/atualizacoes'), doRodape('/regulacao-de-neurodados')]
    .filter(Boolean).map(([r, c]) => link(r, c)).join('');
  const colunaDocumentacao = [[D.api.titulo, '/documentacao#api'], [D.mcp.titulo, '/documentacao#mcp'], [D.skill.titulo, '/documentacao#skill'], [D.downloads.titulo, '/documentacao#downloads']]
    .map(([r, c]) => link(r, c)).join('');
  const mantido = esc(RODAPE.mantido).replace('Clínica NeuroBee', `<a href="${ctx.mantenedorUrl}">Clínica NeuroBee</a>`);
  const legais = link(...doRodape('/licencas')) + `<li><a href="${ctx.privacidade}">${esc(RODAPE.privacidade)}</a></li>`;
  // O crédito de quem desenvolveu o portal: o logo decorativo (alt vazio) e o nome em destaque, como no site da T&D.
  // O link vai à LP da agência, sem a barra no fim (com ela, a página responde 307); o texto do link é a marca.
  const credito = `<p class="rodape__credito"><a href="https://otimizapro.com/agencia-de-marketing-digital" target="_blank" rel="noopener"><img src="${ctx.prefixo}/otimiza-marca.webp" alt="" width="22" height="22" loading="lazy" decoding="async"><span>${esc(RODAPE.credito).replace('Otimiza.pro', '</span><strong>Otimiza.pro</strong>')}</a></p>`;

  const grafoCompleto = [
    { '@type': 'MedicalBusiness', '@id': ctx.mantenedorId, name: 'Clínica NeuroBee', url: ctx.mantenedorUrl },
    ...grafo,
  ];
  const medicao = (ctx.ga4 || ctx.clarity)
    ? `<script src="${ctx.prefixo}/medicao.js?v=${ctx.medicaoV}" defer data-ga4="${esc(ctx.ga4)}" data-clarity="${esc(ctx.clarity)}"></script>`
    : '';
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
${ctx.previa ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(MARCA.nome)}">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${url}">
<meta name="theme-color" content="#fff8e8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${ctx.prefixo}/marca.svg" type="image/svg+xml">
<script src="${ctx.prefixo}/tema.js?v=${ctx.temaV}"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${ctx.prefixo}/estilo.css?v=${ctx.cssV}">
${extraHead}${jsonLd({ '@context': 'https://schema.org', '@graph': grafoCompleto })}
${medicao}
</head>
<body>
<a class="pular" href="#conteudo">${esc(PULAR)}</a>
<header class="cabecalho"><div class="container cabecalho__interno">
<a class="cabecalho__logo" href="${ctx.prefixo}">${ICONE}<span class="cabecalho__nome"><strong>${esc(MARCA.nome)}</strong><small>${esc(MARCA.assinatura)}</small></span></a>
<nav class="cabecalho__nav" aria-label="${esc(MENU_ROTULO)}"><ul class="cabecalho__lista">${menu}</ul></nav>
${seletorTema}
</div></header>
<main id="conteudo">
${trilhaHtml(ctx, trilha)}${corpo}
</main>
<footer class="rodape"><div class="container">
<div class="rodape__grade">
<div class="rodape__marca"><a class="rodape__logo" href="${ctx.prefixo}">${ICONE}<span>${esc(MARCA.nome)}</span></a><p>${esc(MARCA.assinatura)}</p></div>
<div><h2>${esc(rotuloDoMenu('/bases'))}</h2><ul>${colunaBases}</ul></div>
<div><h2>${esc(RODAPE.projeto)}</h2><ul>${colunaProjeto}</ul></div>
<div><h2>${esc(rotuloDoMenu('/documentacao'))}</h2><ul>${colunaDocumentacao}</ul></div>
</div>
<div class="rodape__base"><div><p>${mantido}</p><p>${esc(RODAPE.licenca)}</p></div><ul>${legais}</ul></div>
${credito}
</div></footer>
</body>
</html>
`;
}

function secoes(lista, vars = {}) {
  return lista.map((s) => {
    let h = `<h2>${esc(s.titulo)}</h2>`;
    for (const p of s.paragrafos || []) h += `<p>${fmtHtml(p, vars)}</p>`;
    if (s.itens) h += `<ul>${s.itens.map((i) => `<li>${fmtHtml(i, vars)}</li>`).join('')}</ul>`;
    if (s.depois) h += `<p>${fmtHtml(s.depois, vars)}</p>`;
    return h;
  }).join('\n');
}

const aviso = () => `<p class="aviso">${esc(AVISO)}</p>`;
const mailto = (ctx) => `<a href="mailto:${ctx.email}">${esc(ctx.email)}</a>`;
const paginaWeb = (ctx, caminho, nome) => ({
  '@type': 'WebPage', '@id': ctx.urlBase + caminho, url: ctx.urlBase + caminho, name: nome, inLanguage: 'pt-BR',
  isPartOf: { '@id': ctx.urlBase + '#catalogo' }, publisher: { '@id': ctx.mantenedorId },
});

// A abertura clara das páginas internas: título, chamada e, se houver, o resto (meta, botões).
function abertura({ h1, chamada = '', olho = '', extra = '', estreita = false, compacta = true }) {
  return `<section class="hero${compacta ? ' hero--compacto' : ''}"><div class="${estreita ? 'container-estreito' : 'container'}"><div class="hero__texto">${olho ? `<p class="olho">${esc(olho)}</p>` : ''}<h1>${esc(h1)}</h1>${chamada ? `<p class="hero__chamada">${esc(chamada)}</p>` : ''}${extra}</div></div></section>`;
}
// Uma faixa de texto corrido, na coluna estreita.
const faixaTexto = (html, classe = '') => `<section class="secao${classe ? ' ' + classe : ''}"><div class="container-estreito"><div class="prosa">${html}</div></div></section>`;

// O título sem o nome na frente ("NeuroBase: conceitos..." vira "Conceitos...").
function subtitulo(nome, titulo) {
  const s = titulo.startsWith(nome + ": ") ? titulo.slice(nome.length + 2) : titulo;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Contas que as páginas usam.
export function resumoBase(ctx, base, publicos) {
  return {
    id: base.id,
    nome: base.dataset.nome,
    titulo: base.dataset.titulo,
    subtitulo: subtitulo(base.dataset.nome, base.dataset.titulo),
    versao: base.dataset.versao,
    n: publicos.length,
    url: `${ctx.urlBase}/bases/${base.id}`,
    json: `${ctx.urlBase}/dados/${base.id}.json`,
    jsonl: `${ctx.urlBase}/dados/${base.id}.jsonl`,
    csv: `${ctx.urlBase}/dados/${base.id}.csv`,
    schema: `${ctx.urlBase}/schemas/${base.id}.schema.json`,
    api: `${ctx.urlBase}/api/v1/${base.id}`,
    doi: base.dataset.doi || '',
    huggingface: base.dataset.huggingface || '',
  };
}

const semEsquema = (u) => u.replace('https://', '');

// O cartão de uma base, com o botão que abre a página dela.
const cartaoBase = (b, meta, botao) => `<article class="cartao"><h3>${esc(b.nome)}</h3><p>${esc(b.subtitulo)}</p><p class="meta">${esc(meta)}</p><p class="cartao__acao"><a class="btn btn-pequeno" href="${b.url}">${esc(botao)}</a></p></article>`;

export function paginaInicio(ctx, resumos) {
  const P = PAGINAS.inicio;
  // "NeuroDados Brasil", com a última palavra em destaque, como a palavra-chave do título da T&D.
  const h1 = esc(P.h1).replace(/ (\S+)$/, ' <em>$1</em>');
  const blocos = (lista) => lista.map((s) => `<div class="bloco"><h2>${esc(s.titulo)}</h2>${(s.paragrafos || []).map((p) => `<p>${esc(p)}</p>`).join('')}</div>`).join('');
  const usar = P.usar.itens.map(([t, d]) => `<article class="cartao"><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join('');
  const corpo = `<section class="hero hero--abertura"><div class="container hero__grade">
<div class="hero__texto"><h1>${h1}</h1><p class="hero__chamada">${esc(P.intro)}</p><p class="hero__assinatura">${esc(MARCA.assinatura)}</p>
<div class="grupo-btn hero__acoes"><a class="btn btn-primario" href="#bases">${esc(P.verBases)}</a><a class="btn" href="${ctx.prefixo}/documentacao">${esc(P.usar.link)}</a></div></div>
<div class="hero__midia" aria-hidden="true"><div class="hero__marca">${ICONE}</div></div>
</div></section>
<section class="secao"><div class="container grade grade-2">${blocos(P.secoes)}</div></section>
<section class="secao secao-escura" id="bases"><div class="container"><div class="cabecalho-secao"><h2>${esc(P.bases)}</h2></div>
<div class="grade grade-3">${resumos.map((b) => cartaoBase(b, fmt(P.contagem, b), fmt(P.abrirBase, b))).join('')}</div></div></section>
<section class="secao secao-alt"><div class="container"><div class="cabecalho-secao"><h2>${esc(P.usar.titulo)}</h2></div>
<div class="grade grade-4">${usar}</div>
<p class="secao__acao"><a class="btn btn-primario" href="${ctx.prefixo}/documentacao">${esc(P.usar.link)}</a></p></div></section>
<section class="secao"><div class="container grade grade-2">${blocos([P.naoE])}<div class="bloco"><h2>${esc(P.confianca.titulo)}</h2>${P.confianca.paragrafos.map((p) => `<p>${esc(p)}</p>`).join('')}
<p class="links-seta">${P.confianca.links.map(([r, c]) => `<a href="${ctx.prefixo}${c}">${esc(r)}</a>`).join('')}</p></div></div></section>`;
  const grafo = [
    {
      '@type': 'DataCatalog', '@id': ctx.urlBase + '#catalogo', name: MARCA.nome, description: P.intro, url: ctx.urlBase,
      inLanguage: 'pt-BR', publisher: { '@id': ctx.mantenedorId }, creator: { '@id': ctx.mantenedorId },
      dataset: resumos.map((b) => ({ '@id': b.url + '#dataset' })),
    },
    { '@type': 'WebPage', '@id': ctx.urlBase, url: ctx.urlBase, name: P.titulo, inLanguage: 'pt-BR', about: { '@id': ctx.urlBase + '#catalogo' }, publisher: { '@id': ctx.mantenedorId } },
  ];
  return pagina(ctx, { caminho: '', titulo: P.titulo, descricao: P.descricao, corpo, grafo });
}

export function paginaTexto(ctx, chave, caminho) {
  const P = PAGINAS[chave];
  const corpo = abertura({ h1: P.h1, chamada: P.intro, estreita: true }) + faixaTexto(secoes(P.secoes, { email: mailto(ctx) }), 'secao--junta');
  return pagina(ctx, { caminho, titulo: P.titulo, descricao: P.descricao, corpo, grafo: [paginaWeb(ctx, caminho, P.titulo)], trilha: trilhaSimples(caminho, P.h1) });
}

// "Regulação de Neurodados": o texto vem de REGULACAO, com **negrito** e chamadas [n] para as fontes.
const comRefs = (t) => esc(t)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\[(\d+)\]/g, (m, n) => `<sup class="ref"><a href="#fonte-${n}" aria-label="${esc(fmt(ROTULOS.fonteN, { n }))}">${n}</a></sup>`);
// Os endereços viram links, sem a pontuação que fecha a frase ou o parêntese.
const URL_NO_TEXTO = /https?:\/\/[^\s<]+?(?=[.,;)]{0,2}(?:\s|$))/g;
const comLinks = (t) => esc(t).replace(URL_NO_TEXTO, (u) => `<a href="${u}">${u}</a>`);

export function paginaRegulacao(ctx) {
  const P = REGULACAO;
  const caminho = '/regulacao-de-neurodados';
  const bloco = (b) => (b.lista ? `<ul>${b.lista.map((i) => `<li>${comRefs(i)}</li>`).join('')}</ul>` : `<p>${comRefs(b.p)}</p>`);
  const T = P.tabela;
  const tabela = `<h2>${esc(T.titulo)}</h2><div class="tabela tabela-normas"><table><thead><tr>${T.colunas.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${T.linhas.map((l) => `<tr>${l.map((c, j) => `<td data-rotulo="${esc(T.colunas[j])}">${comRefs(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const partes = P.secoes.map((s, i) => `<h2>${esc(s.titulo)}</h2>${s.blocos.map(bloco).join('')}${i + 1 === T.depoisDaSecao ? tabela : ''}`);
  const fontes = `<h2>${esc(P.fontesTitulo)}</h2><p>${esc(P.fontesNota)}</p><ol class="fontes">${P.fontes.map((f, i) => `<li id="fonte-${i + 1}"><strong>${esc(f.titulo)}</strong> ${comLinks(f.resto)}</li>`).join('')}</ol>`;
  const corpo = abertura({ h1: P.h1, estreita: true, extra: `<p class="hero__meta">${esc(P.data)}</p>` })
    + faixaTexto(`${P.intro.map((p) => `<p class="lead">${comRefs(p)}</p>`).join('')}
${partes.join('\n')}
${fontes}
${aviso()}`, 'secao--junta prosa--artigo');
  const primeiroEndereco = (t) => (t.match(URL_NO_TEXTO) || [])[0];
  const grafo = [
    {
      '@type': 'Article', '@id': ctx.urlBase + caminho + '#artigo', headline: P.h1, description: P.descricao, inLanguage: 'pt-BR',
      datePublished: '2026-11-09', dateModified: '2026-11-09', url: ctx.urlBase + caminho, publisher: { '@id': ctx.mantenedorId },
      citation: P.fontes.map((f) => ({ '@type': 'CreativeWork', name: f.titulo, url: primeiroEndereco(f.resto) })),
    },
    paginaWeb(ctx, caminho, P.titulo),
  ];
  return pagina(ctx, { caminho, titulo: P.titulo, descricao: P.descricao, corpo, grafo, trilha: trilhaSimples(caminho, rotuloDoRodape(caminho) || P.h1) });
}
const rotuloDoRodape = (caminho) => (RODAPE.links.find(([, c]) => c === caminho) || [])[0];

export function paginaMetodologia(ctx) {
  const P = PAGINAS.metodologia;
  const passos = `<ol class="passos">${P.passos.map(([t, d]) => `<li><div><strong>${esc(t)}.</strong> ${esc(d)}</div></li>`).join('')}</ol>`;
  const corpo = abertura({ h1: P.h1, estreita: true }) + faixaTexto(passos + secoes(P.secoes), 'secao--junta');
  return pagina(ctx, { caminho: '/metodologia', titulo: P.titulo, descricao: P.descricao, corpo, grafo: [paginaWeb(ctx, '/metodologia', P.titulo)], trilha: trilhaSimples('/metodologia', P.h1) });
}

export function paginaBases(ctx, resumos) {
  const P = PAGINAS.bases;
  const corpo = abertura({ h1: P.h1, chamada: P.intro, compacta: false })
    + `<section class="secao secao-alt"><div class="container grade grade-3">${resumos.map((b) => cartaoBase(b, fmt(P.linhaBase, b), P.abrir)).join('')}</div></section>`;
  return pagina(ctx, { caminho: '/bases', titulo: P.titulo, descricao: P.descricao, corpo, grafo: [paginaWeb(ctx, '/bases', P.titulo)], trilha: trilhaSimples('/bases', P.h1) });
}

// Agrupa as normas pelo lugar: federais primeiro, depois cada estado e cada município, em ordem alfabética.
function jurisdicoes(registros) {
  const G = PAGINAS.base.gruposNormas;
  const mapa = new Map();
  for (const r of registros) {
    const n = r.norma || {};
    const ordem = { federal: 0, estadual: 1, municipal: 2 }[n.abrangencia] ?? 3;
    const chave = [ordem, n.uf || '', n.municipio || ''].join('|');
    if (!mapa.has(chave)) mapa.set(chave, { chave, rotulo: fmt(G[n.abrangencia] || G.federal, { uf: n.uf || '', municipio: n.municipio || '' }), registros: [] });
    mapa.get(chave).registros.push(r);
  }
  return [...mapa.values()].sort((a, b) => a.chave.localeCompare(b.chave, 'pt-BR'));
}

function nomeComSigla(r) {
  return r.sigla ? `${r.nome} (${r.sigla})` : r.nome;
}

export function paginaBase(ctx, base, publicos, resumo) {
  const P = PAGINAS.base;
  const d = base.dataset;
  const ano = d.atualizado_em.slice(0, 4);
  const porCategoria = (registros, nivel) => Object.entries(CATEGORIAS[base.id] || {}).map(([cat, rotulo]) => {
    // No NeuroDireitos, as normas ficam em ordem de data (a mais antiga primeiro); nas outras bases, em ordem alfabética.
    const ordem = base.id === 'neurodireitos'
      ? (a, b) => (a.norma?.data || '').localeCompare(b.norma?.data || '') || a.nome.localeCompare(b.nome, 'pt-BR')
      : (a, b) => a.nome.localeCompare(b.nome, 'pt-BR');
    const lista = registros.filter((r) => r.categoria === cat).sort(ordem);
    if (!lista.length) return '';
    const cartoes = lista.map((r) => `<article class="cartao cartao--registro"><h3><a href="${resumo.url}/${r.slug}">${esc(nomeComSigla(r))}</a></h3><p class="id">${esc(r.id)}${ctx.previa && r.estado === 'rascunho' ? ' <span class="etiqueta">rascunho</span>' : ''}</p><p>${esc(r.definicao)}</p></article>`).join('');
    return `<div class="categoria"><${nivel}>${esc(rotulo)}</${nivel}><div class="grade grade-3">${cartoes}</div></div>`;
  }).join('');
  // NeuroDireitos com normas de estados ou municípios: um grupo por lugar (federal, cada UF, cada município).
  const lugares = base.id === 'neurodireitos' ? jurisdicoes(publicos) : [];
  const grupos = lugares.length > 1
    ? lugares.map((g) => `<div class="jurisdicao"><h3>${esc(g.rotulo)}</h3>${porCategoria(g.registros, 'h4')}</div>`).join('')
    : porCategoria(publicos, 'h3');
  const enderecos = { JSON: resumo.json, JSONL: resumo.jsonl, CSV: resumo.csv, Schema: resumo.schema, API: resumo.api };
  const [zenodo, hf, github] = P.repositorios;
  const linhasRepositorios = [
    d.doi ? [...zenodo, `https://doi.org/${d.doi}`] : null,
    d.huggingface ? [...hf, d.huggingface] : null,
    ctx.github ? [...github, ctx.github] : null,
  ].filter(Boolean).map(([f, o, u]) => `<tr><th>${esc(f)}</th><td>${esc(o)}</td><td><a href="${u}">${esc(semEsquema(u))}</a></td></tr>`).join('');
  const downloads = `<div class="tabela"><table><tbody>${P.downloads.map(([f, o]) => `<tr><th>${esc(f)}</th><td>${esc(o)}</td><td><a href="${enderecos[f]}">${esc(enderecos[f].replace('https://', ''))}</a></td></tr>`).join('')}${linhasRepositorios}</tbody></table></div>`;
  const textos = P.porBase[base.id] || { titulo: `${d.nome} | ${MARCA.nome}`, descricao: d.descricao.slice(0, 155) };
  const corpo = abertura({
    olho: rotuloDoMenu('/bases'), h1: d.nome, chamada: d.descricao, compacta: false,
    extra: `<p class="hero__meta">${esc(fmt(PAGINAS.bases.linhaBase, resumo))}</p><div class="grupo-btn hero__acoes"><a class="btn btn-primario" href="#baixar">${esc(P.baixar)}</a><a class="btn" href="#citar">${esc(P.citar)}</a></div>`,
  })
    + `<section class="secao"><div class="container"><div class="cabecalho-secao"><h2>${esc(P.registros)}</h2></div>${grupos}</div></section>
<section class="secao secao-alt" id="baixar"><div class="container"><div class="cabecalho-secao"><h2>${esc(P.baixar)}</h2></div>${downloads}</div></section>
<section class="secao" id="citar"><div class="container"><div class="prosa">
<h2>${esc(P.citar)}</h2><p class="citacao">${esc(fmt(d.doi ? P.citacaoDoi : P.citacao, { titulo: d.titulo, versao: d.versao, ano, url: resumo.url, doi: d.doi || '' }))}</p>
<h2>${esc(P.limitacoes)}</h2><ul>${d.limitacoes.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
<h2>${esc(P.versoes)}</h2><ul>${d.historico_de_versoes.slice().reverse().map((v) => `<li><strong>${esc(v.versao)}</strong> (${esc(porExtenso(v.data))}): ${esc(v.mudanca)}</li>`).join('')}</ul>
${aviso()}</div></div></section>`;
  const grafo = [
    {
      '@type': 'Dataset', '@id': resumo.url + '#dataset', name: d.titulo, alternateName: d.nome, description: d.descricao, url: resumo.url,
      version: d.versao, datePublished: d.criado_em, dateModified: d.atualizado_em, inLanguage: 'pt-BR', isAccessibleForFree: true,
      license: d.licenca.url, keywords: d.palavras_chave || [], creator: { '@id': ctx.mantenedorId }, publisher: { '@id': ctx.mantenedorId },
      includedInDataCatalog: { '@id': ctx.urlBase + '#catalogo' },
      ...(d.doi ? { identifier: `https://doi.org/${d.doi}` } : {}),
      ...(d.doi || d.huggingface ? { sameAs: [d.doi ? `https://doi.org/${d.doi}` : '', d.huggingface || ''].filter(Boolean) } : {}),
      distribution: [
        { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: resumo.json },
        { '@type': 'DataDownload', encodingFormat: 'application/x-ndjson', contentUrl: resumo.jsonl },
        { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: resumo.csv },
      ],
    },
    paginaWeb(ctx, `/bases/${base.id}`, textos.titulo),
  ];
  if (base.id === 'neurodireitos') {
    // As normas não são termos: o dataset aponta para cada uma como Legislation.
    grafo[0].hasPart = publicos.map((r) => ({ '@id': `${resumo.url}/${r.slug}#norma` }));
  } else if (base.id !== 'evidenciabase') {
    grafo.push({
      '@type': 'DefinedTermSet', '@id': resumo.url + '#termos', name: d.nome, url: resumo.url,
      hasDefinedTerm: publicos.map((r) => ({ '@id': `${resumo.url}/${r.slug}#termo` })),
    });
  }
  const trilha = [[REGISTRO.migalha[0], ''], [REGISTRO.migalha[1], '/bases'], [d.nome, null]];
  return pagina(ctx, { caminho: `/bases/${base.id}`, titulo: textos.titulo, descricao: textos.descricao, corpo, grafo, trilha });
}

// "de 6 a 16 anos", a partir dos meses, quando o registro não traz a descrição.
function faixaEtariaTexto(f) {
  if (!f) return '';
  if (f.descricao) return f.descricao;
  const T = REGISTRO.idade;
  const idade = (m) => (m % 12 === 0 ? fmt(T.anos, { n: m / 12 }) : m < 24 ? fmt(T.meses, { n: m }) : fmt(T.anosEMeses, { a: Math.floor(m / 12), m: m % 12 }));
  if (f.de_meses != null && f.ate_meses != null) return fmt(T.entre, { de: idade(f.de_meses), ate: idade(f.ate_meses) });
  if (f.de_meses != null) return fmt(T.aPartir, { de: idade(f.de_meses) });
  return '';
}

function linhas(pares) {
  const itens = pares.filter(([, v]) => v);
  if (!itens.length) return '';
  return `<div class="tabela"><table><tbody>${itens.map(([r, v]) => `<tr><th>${esc(r)}</th><td>${v}</td></tr>`).join('')}</tbody></table></div>`;
}

function blocoInstrumento(r, refs) {
  const I = REGISTRO.instrumento;
  const i = r.instrumento;
  if (!i) return '';
  const s = i.satepsi;
  const situacao = [esc(I.situacoes[s.situacao]), s.normas_validas_ate ? esc(fmt(I.normas, { data: porExtenso(s.normas_validas_ate) })) : '', esc(fmt(I.consulta, { data: porExtenso(s.consultado_em) }))].filter(Boolean).join(', ') + refs([s.fonte]);
  return `<h2>${esc(I.titulo)}</h2>${linhas([
    [I.nomeOriginal, i.nome_original ? esc(i.nome_original) : ''],
    [I.construtos, esc((i.construtos || []).join('; '))],
    [REGISTRO.faixaEtaria, esc(faixaEtariaTexto(i.faixa_etaria))],
    [I.uso, esc(I.usos[i.uso])],
    [I.satepsi, situacao],
  ])}<p class="nota">${esc(I.aviso)}</p>`;
}

// NeuroDireitos: a ficha da norma, com o link do texto oficial e a vigência conferida.
function blocoNorma(r, refs) {
  const N = REGISTRO.norma;
  const n = r.norma;
  if (!n) return '';
  const oficial = (r.fontes || []).find((f) => f.id === n.fonte);
  const v = n.vigencia || {};
  const vigencia = [esc(N.situacoes[v.situacao] || v.situacao), v.conferido_em ? esc(fmt(N.conferida, { data: porExtenso(v.conferido_em) })) : ''].filter(Boolean).join(', ') + refs([n.fonte]);
  const lista = (xs) => (xs && xs.length ? esc(xs.join('; ')) : '');
  const lugar = [N.abrangencias[n.abrangencia] || n.abrangencia, n.uf, n.municipio].filter(Boolean).join(', ');
  return `<h2>${esc(N.titulo)}</h2>${linhas([
    [N.tipo, esc(N.tipos[n.tipo] || n.tipo)],
    [N.numero, esc(n.numero)],
    [N.data, esc(porExtenso(n.data))],
    [N.orgao, esc(n.orgao)],
    [N.ementa, esc(n.ementa)],
    [N.publicacao, n.publicacao ? esc(n.publicacao) : ''],
    [N.abrangencia, esc(lugar)],
    [N.vigencia, vigencia],
    [N.alteracoes, lista(v.alteracoes)],
    [N.revogadaPor, v.revogada_por ? esc(v.revogada_por) : ''],
    [N.regulamentadaPor, lista(n.regulamentada_por)],
    [N.condicoes, esc((r.condicoes || []).map((c) => CONDICOES[c] || c).join(', '))],
    [N.areas, esc((r.areas || []).map((a) => AREAS[a] || a).join(', '))],
    [N.textoOficial, oficial ? `<a href="${esc(oficial.url)}">${esc(semEsquema(oficial.url))}</a>` : ''],
  ])}<p class="nota">${esc(N.aviso)}</p>`;
}

function blocoIntervencao(r) {
  const I = REGISTRO.intervencao;
  const lista = (xs) => (xs && xs.length ? `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');
  const partes = [
    [I.objetivos, lista(r.objetivos)],
    [I.publico, r.publico ? `<p>${esc(r.publico)}</p>` : ''],
    [I.contextos, lista(r.contextos)],
    [I.profissionais, lista(r.profissionais)],
  ].filter(([, h]) => h);
  return partes.map(([t, h]) => `<h2>${esc(t)}</h2>${h}`).join('\n');
}

function blocoPublicacao(r) {
  const P = REGISTRO.publicacao;
  const p = r.publicacao;
  if (!p) return '';
  const link = p.doi ? `https://doi.org/${p.doi}` : p.url;
  return `<h2>${esc(P.titulo)}</h2>${linhas([
    [P.tituloOriginal, `<a href="${esc(link)}">${esc(p.titulo_original)}</a>`],
    [P.autores, esc(p.autores.join('; '))],
    [P.ano, esc(String(p.ano))],
    [P.veiculo, esc(p.veiculo)],
    [P.tipo, esc((P.tipos || {})[r.categoria] || '')],
    ['DOI', p.doi ? `<a href="https://doi.org/${esc(p.doi)}">${esc(p.doi)}</a>` : ''],
    [P.acessoAberto, p.acesso_aberto == null ? '' : esc(p.acesso_aberto ? P.sim : P.nao)],
    [P.temas, esc((r.temas || []).map((t) => TEMAS[t] || t).join(', '))],
    [P.populacao, r.populacao ? esc(r.populacao) : ''],
    [P.metodo, r.metodo ? esc(r.metodo) : ''],
  ])}`;
}

// Categorias da NeuroBase que são condições de saúde (MedicalCondition nos dados estruturados).
const CONDICOES_MEDICAS = new Set(['condicao_do_neurodesenvolvimento', 'deficiencia_ou_condicao_associada']);

export function paginaRegistro(ctx, base, r, indice, resumo) {
  const R = REGISTRO;
  const nomeBase = base.dataset.nome;
  const evidencia = base.id === 'evidenciabase';
  const url = `${resumo.url}/${r.slug}`;
  const api = `${resumo.api}/${r.slug}`;
  const ordem = new Map(r.fontes.map((f, i) => [f.id, i + 1]));
  const refs = (ids) => ids.map((id) => `<sup class="ref"><a href="#fonte-${ordem.get(id)}" aria-label="${esc(fmt(ROTULOS.fonteN, { n: ordem.get(id) }))}">${ordem.get(id)}</a></sup>`).join('');
  const afirmacoes = `<ul class="afirmacoes">${r.afirmacoes.map((a) => `<li>${esc(a.texto)}${refs(a.fontes)}</li>`).join('')}</ul>`;
  const classif = (r.classificacoes || []).length
    ? `<h2>${esc(R.classificacoes)}</h2><div class="tabela"><table><thead><tr><th>${esc(ROTULOS.sistema)}</th><th>${esc(ROTULOS.codigo)}</th><th>${esc(ROTULOS.titulo)}</th><th>${esc(ROTULOS.fonte)}</th></tr></thead><tbody>${r.classificacoes.map((c) => `<tr><td>${esc(c.sistema)}</td><td><code>${esc(c.codigo)}</code></td><td>${esc(c.titulo)}</td><td>${refs([c.fonte])}</td></tr>`).join('')}</tbody></table></div>`
    : '';
  const rel = (r.relacionados || []).filter((x) => indice.has(x.id));
  const relacionados = rel.length
    ? `<h2>${esc(R.relacionados)}</h2><ul>${rel.map((x) => `<li>${esc(RELACOES[x.tipo])}: <a href="${indice.get(x.id).url}">${esc(indice.get(x.id).nome)}</a></li>`).join('')}</ul>`
    : '';
  const fontes = `<ol class="fontes">${r.fontes.map((f, i) => {
    const partes = [`<a href="${esc(f.url)}">${esc(f.titulo)}</a>`, esc(f.autor), String(f.ano)];
    if (f.referencia) partes.push(esc(f.referencia));
    if (f.doi) partes.push(`DOI <a href="https://doi.org/${esc(f.doi)}">${esc(f.doi)}</a>`);
    partes.push(esc(fmt(R.consultadoEm, { data: porExtenso(f.consultado_em) })));
    return `<li id="fonte-${i + 1}">${partes.join('. ')}.${f.trecho ? `<span class="trecho">"${esc(f.trecho)}"</span>` : ''}</li>`;
  }).join('')}</ol>`;
  const rev = r.revisao;
  const revisor = (rev.revisores || []).at(-1);
  const situacaoTexto = rev.situacao === 'revisado' && revisor
    ? fmt(R.situacoes.revisado, { nome: revisor.nome, conselho: revisor.conselho, registro: revisor.registro, data: porExtenso(revisor.data) })
    : fmt(R.situacoes[rev.situacao], { data: porExtenso(rev.conferido_em) });
  const estadoAviso = R.estados[r.estado] ? `<p class="aviso">${esc(R.estados[r.estado])}</p>` : '';
  const ano = r.atualizado_em.slice(0, 4);
  const titulo = fmt(R.tituloPagina, { nome: nomeComSigla(r), base: nomeBase });
  const descricao = r.definicao.length > 158 ? r.definicao.slice(0, 155).replace(/\s+\S*$/, '') + '...' : r.definicao;
  const faixa = !r.instrumento && r.faixa_etaria ? `<p><strong>${esc(R.faixaEtaria)}:</strong> ${esc(faixaEtariaTexto(r.faixa_etaria))}</p>` : '';
  const categoria = (CATEGORIAS[base.id] || {})[r.categoria];
  const selos = `<p class="selos"><a class="selo" href="${resumo.url}">${esc(nomeBase)}</a>${categoria ? `<span class="selo">${esc(categoria)}</span>` : ''}${ctx.previa && r.estado === 'rascunho' ? '<span class="etiqueta">rascunho, ainda não publicado</span>' : ''}</p>`;
  const cabecalho = `<section class="cabecalho-artigo"><div class="container"><div class="cabecalho-artigo__texto">
${selos}
<h1>${esc(nomeComSigla(r))}</h1>
<p class="id">${esc(r.id)}</p>
${estadoAviso}
<h2 class="visualmente-oculto">${esc(evidencia ? R.resumo : R.definicao)}</h2>
<p class="definicao">${esc(r.definicao)}</p>
${(r.nomes_alternativos || []).length ? `<p class="nomes"><strong>${esc(R.nomesAlternativos)}:</strong> ${r.nomes_alternativos.map(esc).join(', ')}</p>` : ''}
</div></div></section>`;
  const texto = `${faixa}
${r.descricao ? `<p>${esc(r.descricao)}</p>` : ''}
${blocoPublicacao(r)}
${blocoInstrumento(r, refs)}
${blocoNorma(r, refs)}
${blocoIntervencao(r)}
<h2>${esc(evidencia ? R.resultados : R.afirmacoes)}</h2>${afirmacoes}
${classif}
${relacionados}
<h2>${esc(R.limitacoes)}</h2><ul>${r.limitacoes.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
<h2>${esc(R.fontes)}</h2>${fontes}`;
  const lateral = `<aside class="artigo__lateral">
<div class="lateral__bloco${rev.situacao === 'revisado' ? ' revisado' : ''}"><h2>${esc(R.situacao)}</h2><p>${esc(situacaoTexto)}</p><p>${esc(fmt(R.versao, { versao: r.versao, data: porExtenso(r.atualizado_em) }))}</p></div>
<div class="lateral__bloco"><h2>${esc(R.citar)}</h2><p>${esc(fmt(R.citacao, { nome: nomeComSigla(r), base: nomeBase, versaoBase: base.dataset.versao, ano, url }))}</p></div>
<div class="lateral__bloco"><h2>${esc(R.dados)}</h2><p>${fmtHtml(R.dadosTexto, { api: `<a href="${api}">${esc(api.replace('https://', ''))}</a>` })}</p></div>
</aside>`;
  const corpo = `${cabecalho}
<section class="secao"><div class="container artigo"><div class="artigo__corpo prosa prosa--artigo">${texto}</div>
${lateral}</div></section>
<section class="fecho"><div class="container">${aviso()}
<p class="links-seta"><a href="${resumo.url}">${esc(fmt(R.voltar, { base: nomeBase }))}</a></p></div></section>`;
  let principal;
  if (evidencia && r.publicacao) {
    const p = r.publicacao;
    principal = {
      '@type': 'ScholarlyArticle', '@id': url + '#publicacao', name: p.titulo_original, headline: r.nome, author: p.autores,
      datePublished: String(p.ano), isPartOf: { '@type': 'CreativeWork', name: p.veiculo }, url: p.url, abstract: r.definicao, inLanguage: p.idioma,
    };
    if (p.doi) { principal.identifier = `https://doi.org/${p.doi}`; principal.sameAs = `https://doi.org/${p.doi}`; }
  } else if (r.norma) {
    // schema.org/Legislation: a norma, com a vigência e o texto oficial.
    const n = r.norma;
    const oficial = (r.fontes || []).find((f) => f.id === n.fonte);
    const forca = { vigente: 'https://schema.org/InForce', parcialmente_revogada: 'https://schema.org/PartiallyInForce', revogada: 'https://schema.org/NotInForce' };
    principal = {
      '@type': 'Legislation', '@id': url + '#norma', name: r.nome, alternateName: (r.nomes_alternativos || []).length ? r.nomes_alternativos : undefined,
      description: r.definicao, abstract: n.ementa, legislationIdentifier: `${REGISTRO.norma.tipos[n.tipo] || n.tipo} nº ${n.numero}`,
      legislationDate: n.data, legislationType: REGISTRO.norma.tipos[n.tipo] || n.tipo,
      legislationJurisdiction: n.abrangencia === 'federal' ? 'BR' : n.abrangencia === 'estadual' ? `BR-${n.uf}` : [n.municipio, `BR-${n.uf}`].filter(Boolean).join(', '),
      legislationPassedBy: { '@type': 'Organization', name: n.orgao }, legislationLegalForce: forca[n.vigencia?.situacao],
      inLanguage: 'pt-BR', url: oficial ? oficial.url : url, sameAs: oficial ? oficial.url : undefined,
    };
  } else {
    principal = {
      '@type': CONDICOES_MEDICAS.has(r.categoria) ? ['DefinedTerm', 'MedicalCondition'] : 'DefinedTerm',
      '@id': url + '#termo', name: r.nome, description: r.definicao, url, termCode: r.id,
      inDefinedTermSet: { '@id': resumo.url + '#termos' },
    };
    if ((r.nomes_alternativos || []).length || r.sigla) principal.alternateName = [r.sigla, ...(r.nomes_alternativos || [])].filter(Boolean);
    if (CONDICOES_MEDICAS.has(r.categoria) && (r.classificacoes || []).length) {
      principal.code = r.classificacoes.filter((c) => c.sistema !== 'DSM-5-TR').map((c) => ({ '@type': 'MedicalCode', codeValue: c.codigo, codingSystem: c.sistema === 'CID-10' ? 'ICD-10' : 'ICD-11' }));
    }
  }
  const grafo = [
    principal,
    {
      '@type': 'WebPage', '@id': url, url, name: titulo, inLanguage: 'pt-BR', about: { '@id': principal['@id'] },
      isPartOf: { '@id': resumo.url + '#dataset' }, publisher: { '@id': ctx.mantenedorId }, license: base.dataset.licenca.url,
      dateModified: r.atualizado_em, datePublished: r.criado_em,
      citation: r.fontes.map((f) => ({ '@type': 'CreativeWork', name: f.titulo, url: f.url, author: f.autor, datePublished: String(f.ano) })),
    },
  ];
  const trilha = [[R.migalha[0], ''], [R.migalha[1], '/bases'], [nomeBase, resumo.url], [nomeComSigla(r), null]];
  return pagina(ctx, {
    caminho: `/bases/${base.id}/${r.slug}`, titulo, descricao, corpo, grafo, trilha,
    extraHead: `<link rel="alternate" type="application/json" href="${api}">\n`,
  });
}

// Ferramenta do MCP que depende de uma base: só aparece na documentação quando a base está no ar,
// como no próprio servidor. A busca de instrumentos pede também registro de instrumento.
const BASE_DA_FERRAMENTA = { buscar_conceito: 'neurobase', consultar_tea: 'neurobase', consultar_tdah: 'neurobase', buscar_avaliacao: 'avaliabase', buscar_instrumento: 'avaliabase', buscar_intervencao: 'intervenbase', buscar_evidencias: 'evidenciabase', buscar_norma: 'neurodireitos' };

export function paginaDocumentacao(ctx, resumos, { temInstrumentos = false } = {}) {
  const noAr = new Set(resumos.map((b) => b.id));
  const disponivel = (n) => !BASE_DA_FERRAMENTA[n] || (noAr.has(BASE_DA_FERRAMENTA[n]) && (n !== 'buscar_instrumento' || temInstrumentos));
  const P = PAGINAS.documentacao;
  const api = `${ctx.urlBase}/api/v1`;
  const mcp = `${ctx.urlBase}/mcp`;
  const codigo = (t) => `<code>${esc(t)}</code>`;
  const endpoints = `<div class="tabela tabela-codigo"><table><tbody>${P.api.endpoints.map(([e, d]) => `<tr><td>${codigo(e)}</td><td>${esc(d)}</td></tr>`).join('')}</tbody></table></div>`;
  const ferramentas = `<div class="tabela tabela-codigo"><table><tbody>${Object.entries(FERRAMENTAS_MCP).filter(([n]) => disponivel(n)).map(([n, d]) => `<tr><td>${codigo(n)}</td><td>${esc(d)}</td></tr>`).join('')}</tbody></table></div>`;
  const [zenodo, hf] = PAGINAS.base.repositorios;
  const reposBases = resumos.filter((b) => b.doi || b.huggingface).map((b) => `<li>${esc(b.nome)}: ${[b.doi ? `<a href="https://doi.org/${b.doi}">${esc(zenodo[0])}</a> (DOI ${esc(b.doi)})` : '', b.huggingface ? `<a href="${b.huggingface}">${esc(hf[0])}</a>` : ''].filter(Boolean).join(' · ')}</li>`).join('');
  const configMcp = JSON.stringify({ mcpServers: { neurodados: { type: 'http', url: mcp } } }, null, 2);
  const downloads = resumos.map((b) => `<li>${esc(b.nome)}: <a href="${b.json}">JSON</a> · <a href="${b.jsonl}">JSONL</a> · <a href="${b.csv}">CSV</a> · <a href="${b.schema}">${esc(ROTULOS.schema)}</a></li>`).join('')
    + `<li><a href="${ctx.urlBase}/schemas/comum.schema.json">comum.schema.json</a> · <a href="${ctx.urlBase}/schemas/dataset.schema.json">dataset.schema.json</a> · <a href="${ctx.urlBase}/dados/catalogo.json">catalogo.json</a></li>`;
  const texto = `<h2 id="api">${esc(P.api.titulo)}</h2>${P.api.paragrafos.map((p) => `<p>${fmtHtml(p, { api: codigo(api) })}</p>`).join('')}
${endpoints}
<h3>${esc(P.api.exemplo)}</h3><pre><code>curl ${esc(api)}/neurobase/tea</code></pre>
<h2 id="mcp">${esc(P.mcp.titulo)}</h2>${P.mcp.paragrafos.map((p) => `<p>${fmtHtml(p, { mcp: codigo(mcp) })}</p>`).join('')}
<h3>${esc(P.mcp.ferramentas)}</h3>${ferramentas}
<pre><code>${esc(configMcp)}</code></pre>
<h2 id="skill">${esc(P.skill.titulo)}</h2>${P.skill.paragrafos.map((p) => `<p>${esc(p)}</p>`).join('')}
<p class="links-seta"><a href="${ctx.urlBase}/skill/SKILL.md">${esc(P.skill.link)}</a></p>
<h2 id="downloads">${esc(P.downloads.titulo)}</h2>${P.downloads.paragrafos.map((p) => `<p>${esc(p)}</p>`).join('')}<ul>${downloads}</ul>
<h2 id="repositorios">${esc(P.repositorios.titulo)}</h2>${P.repositorios.paragrafos.map((p) => `<p>${fmtHtml(p, { github: `<a href="${ctx.github}">${esc(semEsquema(ctx.github))}</a>` })}</p>`).join('')}${reposBases ? `<ul>${reposBases}</ul>` : ''}
<h2 id="llms">${esc(P.llms.titulo)}</h2>${P.llms.paragrafos.map((p) => `<p>${fmtHtml(p, { llms: `<a href="${ctx.urlBase}/llms.txt">${esc(ctx.urlBase.replace('https://', '') + '/llms.txt')}</a>` })}</p>`).join('')}
${aviso()}`;
  const corpo = abertura({ h1: P.h1, estreita: true }) + faixaTexto(texto, 'secao--junta');
  return pagina(ctx, { caminho: '/documentacao', titulo: P.titulo, descricao: P.descricao, corpo, grafo: [paginaWeb(ctx, '/documentacao', P.titulo)], trilha: trilhaSimples('/documentacao', P.h1) });
}

export function paginaAtualizacoes(ctx, bases, publicosPorBase) {
  const P = PAGINAS.atualizacoes;
  const itens = [];
  for (const b of bases) {
    for (const v of b.dataset.historico_de_versoes) itens.push({ data: v.data, texto: `${b.dataset.nome} ${v.versao}: ${v.mudanca}`, url: `${ctx.urlBase}/bases/${b.id}` });
    for (const r of publicosPorBase.get(b.id)) {
      for (const h of r.historico) itens.push({ data: h.data, texto: `${nomeComSigla(r)} (${b.dataset.nome}), versão ${h.versao}: ${h.mudanca}`, url: `${ctx.urlBase}/bases/${b.id}/${r.slug}` });
    }
  }
  itens.sort((a, b) => b.data.localeCompare(a.data) || a.texto.localeCompare(b.texto, 'pt-BR'));
  const corpo = abertura({ h1: P.h1, chamada: P.intro, estreita: true })
    + faixaTexto(`<ul class="linha-do-tempo">${itens.map((l) => `<li><strong>${esc(porExtenso(l.data))}</strong> <a href="${l.url}">${esc(l.texto)}</a></li>`).join('')}</ul>`, 'secao--junta');
  return pagina(ctx, { caminho: '/atualizacoes', titulo: P.titulo, descricao: P.descricao, corpo, grafo: [paginaWeb(ctx, '/atualizacoes', P.titulo)], trilha: trilhaSimples('/atualizacoes', rotuloDoRodape('/atualizacoes') || P.h1) });
}

export function pagina404(ctx) {
  const P = PAGINAS.naoEncontrada;
  const corpo = abertura({
    h1: P.h1, chamada: P.texto, compacta: false,
    extra: `<div class="grupo-btn hero__acoes">${ROTULOS.naoEncontrada.map(([r, c], i) => `<a class="btn${i === 0 ? ' btn-primario' : ''}" href="${ctx.prefixo}${c}">${esc(r)}</a>`).join('')}</div>`,
  });
  return pagina({ ...ctx, previa: true }, { caminho: '/404', titulo: P.titulo, descricao: P.texto, corpo });
}
