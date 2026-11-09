// As páginas do portal do NeuroDados Brasil. Todo texto vem de textos.mjs, dos
// metadados das bases ou dos registros; aqui só se monta o HTML.

import {
  MARCA, AVISO, PULAR, MENU_ROTULO, MENU, RODAPE, CATEGORIAS, RELACOES, REGISTRO, PAGINAS,
  FERRAMENTAS_MCP, ROTULOS, TEMAS,
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

const ICONE = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path class="nd-a" d="M32 4 56 18v28L32 60 8 46V18Z" stroke-width="4" stroke-linejoin="round"/><path class="nd-o" d="M22 24 32 32 42 24M32 32v12" stroke-width="3" stroke-linecap="round" fill="none"/><circle class="nd-of" cx="22" cy="24" r="4.5"/><circle class="nd-of" cx="42" cy="24" r="4.5"/><circle class="nd-of" cx="32" cy="44" r="4.5"/><circle class="nd-af" cx="32" cy="32" r="5.5"/></svg>';

function jsonLd(dados) {
  return `<script type="application/ld+json">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>`;
}

// ctx: { prefixo, urlBase, origem, cssV, medicaoV, previa, ga4, clarity, privacidade, email, mantenedorUrl, mantenedorId }
export function pagina(ctx, { caminho, titulo, descricao, corpo, grafo = [], extraHead = '' }) {
  const url = ctx.urlBase + caminho;
  const atual = (c) => (c === '' ? caminho === '' : caminho === c || caminho.startsWith(c + '/'));
  const menu = MENU.map(([rotulo, c]) => `<li><a href="${ctx.prefixo}${c}"${atual(c) ? ' aria-current="page"' : ''}>${esc(rotulo)}</a></li>`).join('');
  const mantido = esc(RODAPE.mantido).replace('Clínica NeuroBee', `<a href="${ctx.mantenedorUrl}">Clínica NeuroBee</a>`);
  const links = RODAPE.links.map(([r, c]) => `<li><a href="${ctx.prefixo}${c}">${esc(r)}</a></li>`).join('')
    + `<li><a href="${ctx.privacidade}">${esc(RODAPE.privacidade)}</a></li>`;
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Montserrat:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${ctx.prefixo}/estilo.css?v=${ctx.cssV}">
${extraHead}${jsonLd({ '@context': 'https://schema.org', '@graph': grafoCompleto })}
${medicao}
</head>
<body>
<a class="pular" href="#conteudo">${esc(PULAR)}</a>
<header class="topo"><div class="envolve">
<a class="marca" href="${ctx.prefixo}">${ICONE}<span><strong>${esc(MARCA.nome)}</strong><small>${esc(MARCA.assinatura)}</small></span></a>
<nav class="menu" aria-label="${esc(MENU_ROTULO)}"><ul>${menu}</ul></nav>
</div></header>
<main id="conteudo"><div class="envolve">
${corpo}
</div></main>
<footer class="rodape"><div class="envolve">
<div><p><strong>${esc(MARCA.nome)}</strong></p><p>${mantido}</p><p>${esc(RODAPE.licenca)}</p></div>
<ul>${links}</ul>
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

export function paginaInicio(ctx, resumos) {
  const P = PAGINAS.inicio;
  const fichasBases = resumos.map((b) => `<div class="ficha ficha-hex"><h3>${esc(b.nome)}</h3><p>${esc(b.subtitulo)}</p><p class="meta">${esc(fmt(P.contagem, b))}</p><a class="botao" href="${b.url}">${esc(fmt(P.abrirBase, b))}</a></div>`).join('');
  const usar = P.usar.itens.map(([t, d]) => `<div class="ficha"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('');
  const corpo = `<h1>${esc(P.h1)}</h1>
<p class="lead">${esc(P.intro)}</p>
<p class="assinatura">${esc(MARCA.assinatura)}</p>
<div class="texto">${secoes(P.secoes)}</div>
<h2>${esc(P.bases)}</h2>
<div class="grade">${fichasBases}</div>
<h2>${esc(P.usar.titulo)}</h2>
<div class="grade">${usar}</div>
<p><a href="${ctx.prefixo}/documentacao">${esc(P.usar.link)}</a></p>
<div class="texto">${secoes([P.naoE])}
<h2>${esc(P.confianca.titulo)}</h2>${P.confianca.paragrafos.map((p) => `<p>${esc(p)}</p>`).join('')}
<p>${P.confianca.links.map(([r, c]) => `<a href="${ctx.prefixo}${c}">${esc(r)}</a>`).join(' · ')}</p></div>`;
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
  const corpo = `<h1>${esc(P.h1)}</h1>${P.intro ? `<p class="lead">${esc(P.intro)}</p>` : ''}
<div class="texto">${secoes(P.secoes, { email: mailto(ctx) })}</div>`;
  return pagina(ctx, { caminho, titulo: P.titulo, descricao: P.descricao, corpo, grafo: [paginaWeb(ctx, caminho, P.titulo)] });
}

export function paginaMetodologia(ctx) {
  const P = PAGINAS.metodologia;
  const passos = `<ol>${P.passos.map(([t, d]) => `<li><strong>${esc(t)}.</strong> ${esc(d)}</li>`).join('')}</ol>`;
  const corpo = `<h1>${esc(P.h1)}</h1><div class="texto">${passos}${secoes(P.secoes)}</div>`;
  return pagina(ctx, { caminho: '/metodologia', titulo: P.titulo, descricao: P.descricao, corpo, grafo: [paginaWeb(ctx, '/metodologia', P.titulo)] });
}

export function paginaBases(ctx, resumos) {
  const P = PAGINAS.bases;
  const fichas = resumos.map((b) => `<div class="ficha ficha-hex"><h3>${esc(b.nome)}</h3><p>${esc(b.subtitulo)}</p><p class="meta">${esc(fmt(P.linhaBase, b))}</p><a class="botao" href="${b.url}">${esc(P.abrir)}</a></div>`).join('');
  const corpo = `<h1>${esc(P.h1)}</h1><p class="lead">${esc(P.intro)}</p><div class="grade">${fichas}</div>`;
  return pagina(ctx, { caminho: '/bases', titulo: P.titulo, descricao: P.descricao, corpo, grafo: [paginaWeb(ctx, '/bases', P.titulo)] });
}

function nomeComSigla(r) {
  return r.sigla ? `${r.nome} (${r.sigla})` : r.nome;
}

export function paginaBase(ctx, base, publicos, resumo) {
  const P = PAGINAS.base;
  const d = base.dataset;
  const ano = d.atualizado_em.slice(0, 4);
  const grupos = Object.entries(CATEGORIAS[base.id] || {}).map(([cat, rotulo]) => {
    const lista = publicos.filter((r) => r.categoria === cat).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    if (!lista.length) return '';
    return `<h3>${esc(rotulo)}</h3><ul class="registros">${lista.map((r) => `<li><a href="${resumo.url}/${r.slug}">${esc(nomeComSigla(r))}</a> <span class="id">${esc(r.id)}</span>${ctx.previa && r.estado === 'rascunho' ? ' <span class="etiqueta">rascunho</span>' : ''}<p>${esc(r.definicao)}</p></li>`).join('')}</ul>`;
  }).join('');
  const enderecos = { JSON: resumo.json, JSONL: resumo.jsonl, CSV: resumo.csv, Schema: resumo.schema, API: resumo.api };
  const [zenodo, hf, github] = P.repositorios;
  const linhasRepositorios = [
    d.doi ? [...zenodo, `https://doi.org/${d.doi}`] : null,
    d.huggingface ? [...hf, d.huggingface] : null,
    ctx.github ? [...github, ctx.github] : null,
  ].filter(Boolean).map(([f, o, u]) => `<tr><th>${esc(f)}</th><td>${esc(o)}</td><td><a href="${u}">${esc(semEsquema(u))}</a></td></tr>`).join('');
  const downloads = `<div class="tabela"><table><tbody>${P.downloads.map(([f, o]) => `<tr><th>${esc(f)}</th><td>${esc(o)}</td><td><a href="${enderecos[f]}">${esc(enderecos[f].replace('https://', ''))}</a></td></tr>`).join('')}${linhasRepositorios}</tbody></table></div>`;
  const textos = P.porBase[base.id] || { titulo: `${d.nome} | ${MARCA.nome}`, descricao: d.descricao.slice(0, 155) };
  const corpo = `<p class="migalha"><a href="${ctx.prefixo}">${esc(REGISTRO.migalha[0])}</a> › <a href="${ctx.prefixo}/bases">${esc(REGISTRO.migalha[1])}</a> › ${esc(d.nome)}</p>
<h1>${esc(d.nome)}</h1>
<p class="lead">${esc(d.descricao)}</p>
<p class="meta">${esc(fmt(PAGINAS.bases.linhaBase, resumo))}</p>
<h2>${esc(P.registros)}</h2>${grupos}
<h2>${esc(P.baixar)}</h2>${downloads}
<h2>${esc(P.citar)}</h2><p class="texto">${esc(fmt(d.doi ? P.citacaoDoi : P.citacao, { titulo: d.titulo, versao: d.versao, ano, url: resumo.url, doi: d.doi || '' }))}</p>
<h2>${esc(P.limitacoes)}</h2><ul class="texto">${d.limitacoes.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
<h2>${esc(P.versoes)}</h2><ul class="texto">${d.historico_de_versoes.slice().reverse().map((v) => `<li><strong>${esc(v.versao)}</strong> (${esc(porExtenso(v.data))}): ${esc(v.mudanca)}</li>`).join('')}</ul>
${aviso()}`;
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
  if (base.id !== 'evidenciabase') {
    grafo.push({
      '@type': 'DefinedTermSet', '@id': resumo.url + '#termos', name: d.nome, url: resumo.url,
      hasDefinedTerm: publicos.map((r) => ({ '@id': `${resumo.url}/${r.slug}#termo` })),
    });
  }
  return pagina(ctx, { caminho: `/bases/${base.id}`, titulo: textos.titulo, descricao: textos.descricao, corpo, grafo });
}

// "de 6 a 16 anos", a partir dos meses, quando o registro não traz a descrição.
function faixaTexto(f) {
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
    [REGISTRO.faixaEtaria, esc(faixaTexto(i.faixa_etaria))],
    [I.uso, esc(I.usos[i.uso])],
    [I.satepsi, situacao],
  ])}<p class="texto meta">${esc(I.aviso)}</p>`;
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
  return partes.map(([t, h]) => `<h2>${esc(t)}</h2><div class="texto">${h}</div>`).join('\n');
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
    ? `<h2>${esc(R.relacionados)}</h2><ul class="texto">${rel.map((x) => `<li>${esc(RELACOES[x.tipo])}: <a href="${indice.get(x.id).url}">${esc(indice.get(x.id).nome)}</a></li>`).join('')}</ul>`
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
  const faixa = !r.instrumento && r.faixa_etaria ? `<p><strong>${esc(R.faixaEtaria)}:</strong> ${esc(faixaTexto(r.faixa_etaria))}</p>` : '';
  const corpo = `<p class="migalha"><a href="${ctx.prefixo}">${esc(R.migalha[0])}</a> › <a href="${ctx.prefixo}/bases">${esc(R.migalha[1])}</a> › <a href="${resumo.url}">${esc(nomeBase)}</a></p>
${ctx.previa && r.estado === 'rascunho' ? '<p><span class="etiqueta">rascunho, ainda não publicado</span></p>' : ''}
<h1>${esc(nomeComSigla(r))}</h1>
<p class="id">${esc(r.id)}</p>
${estadoAviso}
<h2 class="pular">${esc(evidencia ? R.resumo : R.definicao)}</h2>
<p class="definicao">${esc(r.definicao)}</p>
${(r.nomes_alternativos || []).length ? `<p><strong>${esc(R.nomesAlternativos)}:</strong> ${r.nomes_alternativos.map(esc).join(', ')}</p>` : ''}
${faixa}
${r.descricao ? `<p class="texto">${esc(r.descricao)}</p>` : ''}
${blocoPublicacao(r)}
${blocoInstrumento(r, refs)}
${blocoIntervencao(r)}
<h2>${esc(evidencia ? R.resultados : R.afirmacoes)}</h2>${afirmacoes}
${classif}
${relacionados}
<h2>${esc(R.limitacoes)}</h2><ul class="texto">${r.limitacoes.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
<h2>${esc(R.fontes)}</h2>${fontes}
<h2>${esc(R.situacao)}</h2>
<div class="situacao${rev.situacao === 'revisado' ? ' revisado' : ''}"><p>${esc(situacaoTexto)}</p><p>${esc(fmt(R.versao, { versao: r.versao, data: porExtenso(r.atualizado_em) }))}</p></div>
<h2>${esc(R.citar)}</h2><p class="texto">${esc(fmt(R.citacao, { nome: nomeComSigla(r), base: nomeBase, versaoBase: base.dataset.versao, ano, url }))}</p>
<h2>${esc(R.dados)}</h2><p>${fmtHtml(R.dadosTexto, { api: `<a href="${api}">${esc(api.replace('https://', ''))}</a>` })}</p>
${aviso()}
<p><a href="${resumo.url}">${esc(fmt(R.voltar, { base: nomeBase }))}</a></p>`;
  let principal;
  if (evidencia && r.publicacao) {
    const p = r.publicacao;
    principal = {
      '@type': 'ScholarlyArticle', '@id': url + '#publicacao', name: p.titulo_original, headline: r.nome, author: p.autores,
      datePublished: String(p.ano), isPartOf: { '@type': 'CreativeWork', name: p.veiculo }, url: p.url, abstract: r.definicao, inLanguage: p.idioma,
    };
    if (p.doi) { principal.identifier = `https://doi.org/${p.doi}`; principal.sameAs = `https://doi.org/${p.doi}`; }
  } else {
    principal = {
      '@type': r.categoria === 'condicao_do_neurodesenvolvimento' ? ['DefinedTerm', 'MedicalCondition'] : 'DefinedTerm',
      '@id': url + '#termo', name: r.nome, description: r.definicao, url, termCode: r.id,
      inDefinedTermSet: { '@id': resumo.url + '#termos' },
    };
    if ((r.nomes_alternativos || []).length || r.sigla) principal.alternateName = [r.sigla, ...(r.nomes_alternativos || [])].filter(Boolean);
    if (r.categoria === 'condicao_do_neurodesenvolvimento' && (r.classificacoes || []).length) {
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
  return pagina(ctx, {
    caminho: `/bases/${base.id}/${r.slug}`, titulo, descricao, corpo, grafo,
    extraHead: `<link rel="alternate" type="application/json" href="${api}">\n`,
  });
}

// Ferramenta do MCP que depende de uma base: só aparece na documentação quando a base está no ar,
// como no próprio servidor. A busca de instrumentos pede também registro de instrumento.
const BASE_DA_FERRAMENTA = { buscar_conceito: 'neurobase', consultar_tea: 'neurobase', consultar_tdah: 'neurobase', buscar_avaliacao: 'avaliabase', buscar_instrumento: 'avaliabase', buscar_intervencao: 'intervenbase', buscar_evidencias: 'evidenciabase' };

export function paginaDocumentacao(ctx, resumos, { temInstrumentos = false } = {}) {
  const noAr = new Set(resumos.map((b) => b.id));
  const disponivel = (n) => !BASE_DA_FERRAMENTA[n] || (noAr.has(BASE_DA_FERRAMENTA[n]) && (n !== 'buscar_instrumento' || temInstrumentos));
  const P = PAGINAS.documentacao;
  const api = `${ctx.urlBase}/api/v1`;
  const mcp = `${ctx.urlBase}/mcp`;
  const codigo = (t) => `<code>${esc(t)}</code>`;
  const endpoints = `<div class="tabela"><table><tbody>${P.api.endpoints.map(([e, d]) => `<tr><td>${codigo(e)}</td><td>${esc(d)}</td></tr>`).join('')}</tbody></table></div>`;
  const ferramentas = `<div class="tabela"><table><tbody>${Object.entries(FERRAMENTAS_MCP).filter(([n]) => disponivel(n)).map(([n, d]) => `<tr><td>${codigo(n)}</td><td>${esc(d)}</td></tr>`).join('')}</tbody></table></div>`;
  const [zenodo, hf] = PAGINAS.base.repositorios;
  const reposBases = resumos.filter((b) => b.doi || b.huggingface).map((b) => `<li>${esc(b.nome)}: ${[b.doi ? `<a href="https://doi.org/${b.doi}">${esc(zenodo[0])}</a> (DOI ${esc(b.doi)})` : '', b.huggingface ? `<a href="${b.huggingface}">${esc(hf[0])}</a>` : ''].filter(Boolean).join(' · ')}</li>`).join('');
  const configMcp = JSON.stringify({ mcpServers: { neurodados: { type: 'http', url: mcp } } }, null, 2);
  const downloads = resumos.map((b) => `<li>${esc(b.nome)}: <a href="${b.json}">JSON</a> · <a href="${b.jsonl}">JSONL</a> · <a href="${b.csv}">CSV</a> · <a href="${b.schema}">${esc(ROTULOS.schema)}</a></li>`).join('')
    + `<li><a href="${ctx.urlBase}/schemas/comum.schema.json">comum.schema.json</a> · <a href="${ctx.urlBase}/schemas/dataset.schema.json">dataset.schema.json</a> · <a href="${ctx.urlBase}/dados/catalogo.json">catalogo.json</a></li>`;
  const corpo = `<h1>${esc(P.h1)}</h1>
<div class="texto">
<h2>${esc(P.api.titulo)}</h2>${P.api.paragrafos.map((p) => `<p>${fmtHtml(p, { api: codigo(api) })}</p>`).join('')}
${endpoints}
<h3>${esc(P.api.exemplo)}</h3><pre><code>curl ${esc(api)}/neurobase/tea</code></pre>
<h2>${esc(P.mcp.titulo)}</h2>${P.mcp.paragrafos.map((p) => `<p>${fmtHtml(p, { mcp: codigo(mcp) })}</p>`).join('')}
<h3>${esc(P.mcp.ferramentas)}</h3>${ferramentas}
<pre><code>${esc(configMcp)}</code></pre>
<h2>${esc(P.skill.titulo)}</h2>${P.skill.paragrafos.map((p) => `<p>${esc(p)}</p>`).join('')}
<p><a href="${ctx.urlBase}/skill/SKILL.md">${esc(P.skill.link)}</a></p>
<h2>${esc(P.downloads.titulo)}</h2>${P.downloads.paragrafos.map((p) => `<p>${esc(p)}</p>`).join('')}<ul>${downloads}</ul>
<h2>${esc(P.repositorios.titulo)}</h2>${P.repositorios.paragrafos.map((p) => `<p>${fmtHtml(p, { github: `<a href="${ctx.github}">${esc(semEsquema(ctx.github))}</a>` })}</p>`).join('')}${reposBases ? `<ul>${reposBases}</ul>` : ''}
<h2>${esc(P.llms.titulo)}</h2>${P.llms.paragrafos.map((p) => `<p>${fmtHtml(p, { llms: `<a href="${ctx.urlBase}/llms.txt">${esc(ctx.urlBase.replace('https://', '') + '/llms.txt')}</a>` })}</p>`).join('')}
</div>
${aviso()}`;
  return pagina(ctx, { caminho: '/documentacao', titulo: P.titulo, descricao: P.descricao, corpo, grafo: [paginaWeb(ctx, '/documentacao', P.titulo)] });
}

export function paginaAtualizacoes(ctx, bases, publicosPorBase) {
  const P = PAGINAS.atualizacoes;
  const linhas = [];
  for (const b of bases) {
    for (const v of b.dataset.historico_de_versoes) linhas.push({ data: v.data, texto: `${b.dataset.nome} ${v.versao}: ${v.mudanca}`, url: `${ctx.urlBase}/bases/${b.id}` });
    for (const r of publicosPorBase.get(b.id)) {
      for (const h of r.historico) linhas.push({ data: h.data, texto: `${nomeComSigla(r)} (${b.dataset.nome}), versão ${h.versao}: ${h.mudanca}`, url: `${ctx.urlBase}/bases/${b.id}/${r.slug}` });
    }
  }
  linhas.sort((a, b) => b.data.localeCompare(a.data) || a.texto.localeCompare(b.texto, 'pt-BR'));
  const corpo = `<h1>${esc(P.h1)}</h1><p class="lead">${esc(P.intro)}</p>
<ul class="texto">${linhas.map((l) => `<li><strong>${esc(porExtenso(l.data))}</strong>: <a href="${l.url}">${esc(l.texto)}</a></li>`).join('')}</ul>`;
  return pagina(ctx, { caminho: '/atualizacoes', titulo: P.titulo, descricao: P.descricao, corpo, grafo: [paginaWeb(ctx, '/atualizacoes', P.titulo)] });
}

export function pagina404(ctx) {
  const P = PAGINAS.naoEncontrada;
  const corpo = `<h1>${esc(P.h1)}</h1><p>${esc(P.texto)}</p><p>${ROTULOS.naoEncontrada.map(([r, c]) => `<a href="${ctx.prefixo}${c}">${esc(r)}</a>`).join(" · ")}</p>`;
  return pagina({ ...ctx, previa: true }, { caminho: '/404', titulo: P.titulo, descricao: P.texto, corpo });
}
