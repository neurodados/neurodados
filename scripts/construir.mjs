// Monta o portal, os downloads e os dados do Worker.
//   node scripts/construir.mjs              prévia: todos os registros, com o rascunho marcado, noindex e sem medição
//   node scripts/construir.mjs --publicar   o que vai ao ar: só registros no ar, depois do validador
//                                           e com todo texto igual ao último aprovado
// Saída: dist/site/ (os arquivos do Worker) e worker/gerado/dados.mjs.

import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync, readdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { carregarBases, RAIZ, SITE, URL_BASE, PASTA_SCHEMAS, urlRegistro, urlApiRegistro } from './lib/dados.mjs';
import { coletarTextos, diferencas, CAMINHO_SKILL } from './lib/textos.mjs';
import * as T from '../portal/textos.mjs';
import * as M from '../portal/modelo.mjs';

const PUBLICAR = process.argv.includes('--publicar');
const DIST = join(RAIZ, 'dist');
const SITE_DIR = join(DIST, 'site');
const ND = join(SITE_DIR, SITE.prefixo.slice(1));

function gravar(caminho, conteudo) {
  mkdirSync(dirname(caminho), { recursive: true });
  writeFileSync(caminho, conteudo);
}
const hash = (b) => createHash('sha256').update(b).digest('hex').slice(0, 10);

// 1. Portão da publicação.
if (PUBLICAR) {
  const v = spawnSync(process.execPath, [join(RAIZ, 'scripts', 'validar.mjs')], { stdio: 'inherit' });
  if (v.status !== 0) { console.error('\nO validador achou erro: nada foi montado.'); process.exit(1); }
  const caminhoAprovados = join(RAIZ, '..', 'TEXTOS-APROVADOS.json');
  if (!existsSync(caminhoAprovados)) { console.error('Falta o TEXTOS-APROVADOS.json: os textos ainda não foram aprovados.'); process.exit(1); }
  const aprovados = JSON.parse(readFileSync(caminhoAprovados, 'utf8')).textos;
  const { novos, alterados } = diferencas(coletarTextos({ somenteNoAr: true }), aprovados);
  if (novos.length || alterados.length) {
    console.error('Texto diferente do último aprovado (rode node scripts/textos.mjs e leve à aprovação):');
    for (const k of [...alterados, ...novos].slice(0, 40)) console.error('  ' + k);
    process.exit(1);
  }
}

// 2. O que entra.
const naLista = (r) => (PUBLICAR ? ['publicado', 'desatualizado'].includes(r.estado) : r.estado !== 'arquivado');
const comPagina = (r) => (PUBLICAR ? ['publicado', 'desatualizado', 'arquivado'].includes(r.estado) : true);
// Uma base só aparece quando tem registro: na publicação, registro no ar.
const bases = carregarBases().filter((b) => b.registros.some((r) => comPagina(r.dados)));
// Relação só com registro que tem página nesta montagem: sem isso, o registro no ar
// apontaria para um rascunho que não foi publicado.
const idsComPagina = new Set(bases.flatMap((b) => b.registros.map((r) => r.dados).filter(comPagina).map((r) => r.id)));
const limpo = (base, r) => {
  const { $schema, id, slug, ...resto } = r;
  const saida = { id, slug, url: urlRegistro(base, slug), api_url: urlApiRegistro(base, slug), ...resto };
  if (saida.relacionados) saida.relacionados = saida.relacionados.filter((x) => idsComPagina.has(x.id));
  return saida;
};

rmSync(DIST, { recursive: true, force: true });
mkdirSync(ND, { recursive: true });

const css = readFileSync(join(RAIZ, 'portal', 'estilo.css'));
const medicao = readFileSync(join(RAIZ, 'portal', 'medicao.js'));
gravar(join(ND, 'estilo.css'), css);
gravar(join(ND, 'medicao.js'), medicao);
copyFileSync(join(RAIZ, 'portal', 'marca.svg'), join(ND, 'marca.svg'));

const ctx = {
  prefixo: SITE.prefixo, urlBase: URL_BASE, origem: SITE.origem, cssV: hash(css), medicaoV: hash(medicao),
  previa: !PUBLICAR, ga4: PUBLICAR ? SITE.ga4 : '', clarity: PUBLICAR ? SITE.clarity : '',
  privacidade: SITE.privacidade, email: SITE.email, mantenedorUrl: SITE.mantenedorUrl, mantenedorId: SITE.mantenedorId,
  github: SITE.github, huggingface: SITE.huggingface,
};

const listaPorBase = new Map();
const paginasPorBase = new Map();
const indice = new Map();
const resumos = [];
for (const b of bases) {
  const lista = b.registros.map((r) => r.dados).filter(naLista);
  const paginas = b.registros.map((r) => r.dados).filter(comPagina);
  listaPorBase.set(b.id, lista);
  paginasPorBase.set(b.id, paginas);
  for (const r of paginas) indice.set(r.id, { nome: r.sigla ? `${r.nome} (${r.sigla})` : r.nome, url: urlRegistro(b.id, r.slug) });
  resumos.push(M.resumoBase(ctx, b, lista));
}

// 3. Páginas.
const sitemap = [];
const pagina = (arquivo, html, caminho, lastmod) => {
  gravar(arquivo, html);
  if (caminho !== null) sitemap.push({ loc: URL_BASE + caminho, lastmod });
};
const maisRecente = bases.map((b) => b.dataset.atualizado_em).sort().at(-1);
pagina(join(SITE_DIR, 'neurodados.html'), M.paginaInicio(ctx, resumos), '', maisRecente);
pagina(join(ND, 'sobre.html'), M.paginaTexto(ctx, 'sobre', '/sobre'), '/sobre', maisRecente);
pagina(join(ND, 'governanca.html'), M.paginaTexto(ctx, 'governanca', '/governanca'), '/governanca', maisRecente);
pagina(join(ND, 'licencas.html'), M.paginaTexto(ctx, 'licencas', '/licencas'), '/licencas', maisRecente);
pagina(join(ND, 'contribuicoes.html'), M.paginaTexto(ctx, 'contribuicoes', '/contribuicoes'), '/contribuicoes', maisRecente);
pagina(join(ND, 'metodologia.html'), M.paginaMetodologia(ctx), '/metodologia', maisRecente);
pagina(join(ND, 'bases.html'), M.paginaBases(ctx, resumos), '/bases', maisRecente);
const temInstrumentos = (listaPorBase.get('avaliabase') || []).some((r) => r.categoria === 'instrumento');
pagina(join(ND, 'documentacao.html'), M.paginaDocumentacao(ctx, resumos, { temInstrumentos }), '/documentacao', maisRecente);
pagina(join(ND, 'atualizacoes.html'), M.paginaAtualizacoes(ctx, bases, listaPorBase), '/atualizacoes', maisRecente);
pagina(join(ND, '404.html'), M.pagina404(ctx), null);

for (const [i, b] of bases.entries()) {
  const resumo = resumos[i];
  pagina(join(ND, 'bases', `${b.id}.html`), M.paginaBase(ctx, b, listaPorBase.get(b.id), resumo), `/bases/${b.id}`, b.dataset.atualizado_em);
  for (const r of paginasPorBase.get(b.id)) {
    const html = M.paginaRegistro(ctx, b, r, indice, resumo);
    pagina(join(ND, 'bases', b.id, `${r.slug}.html`), html, r.estado === 'arquivado' ? null : `/bases/${b.id}/${r.slug}`, r.atualizado_em);
  }
}

// 4. Downloads.
const csvCampo = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const COLUNAS = ['id', 'slug', 'nome', 'sigla', 'categoria', 'definicao', 'nomes_alternativos', 'classificacoes', 'fontes', 'situacao_revisao', 'conferido_em', 'estado', 'versao', 'atualizado_em', 'url'];
// Colunas próprias de cada base, depois das comuns (a NeuroBase não tem).
const lista_ = (v) => (v || []).join('; ');
const COLUNAS_DA_BASE = {
  avaliabase: [
    ['instrumento_nome_original', (r) => r.instrumento?.nome_original],
    ['instrumento_uso', (r) => r.instrumento?.uso],
    ['satepsi_situacao', (r) => r.instrumento?.satepsi?.situacao],
    ['satepsi_normas_validas_ate', (r) => r.instrumento?.satepsi?.normas_validas_ate],
    ['satepsi_consultado_em', (r) => r.instrumento?.satepsi?.consultado_em],
  ],
  intervenbase: [
    ['contextos', (r) => lista_(r.contextos)],
    ['profissionais', (r) => lista_(r.profissionais)],
  ],
  evidenciabase: [
    ['publicacao_titulo', (r) => r.publicacao?.titulo_original],
    ['publicacao_autores', (r) => lista_(r.publicacao?.autores)],
    ['publicacao_ano', (r) => r.publicacao?.ano],
    ['publicacao_veiculo', (r) => r.publicacao?.veiculo],
    ['publicacao_doi', (r) => r.publicacao?.doi],
    ['publicacao_url', (r) => r.publicacao?.url],
    ['temas', (r) => lista_(r.temas)],
  ],
};
const catalogo = { nome: T.MARCA.nome, url: URL_BASE, mantenedor: { nome: SITE.mantenedor, url: SITE.mantenedorUrl }, bases: [] };
const registrosWorker = {};
for (const [i, b] of bases.entries()) {
  const lista = listaPorBase.get(b.id).map((r) => limpo(b.id, r));
  registrosWorker[b.id] = lista;
  gravar(join(ND, 'dados', `${b.id}.json`), JSON.stringify(lista, null, 2) + '\n');
  gravar(join(ND, 'dados', `${b.id}.jsonl`), lista.map((r) => JSON.stringify(r)).join('\n') + (lista.length ? '\n' : ''));
  const extras = COLUNAS_DA_BASE[b.id] || [];
  const linhas = [[...COLUNAS, ...extras.map(([nome]) => nome)].join(',')];
  for (const r of lista) {
    linhas.push([
      r.id, r.slug, r.nome, r.sigla, r.categoria, r.definicao,
      (r.nomes_alternativos || []).join('; '),
      (r.classificacoes || []).map((c) => `${c.sistema} ${c.codigo}`).join('; '),
      r.fontes.map((f) => f.url).join(' '),
      r.revisao.situacao, r.revisao.conferido_em, r.estado, r.versao, r.atualizado_em, r.url,
      ...extras.map(([, valor]) => valor(r)),
    ].map(csvCampo).join(','));
  }
  gravar(join(ND, 'dados', `${b.id}.csv`), '﻿' + linhas.join('\r\n') + '\r\n');
  const rs = resumos[i];
  catalogo.bases.push({
    id: b.id, nome: b.dataset.nome, titulo: b.dataset.titulo, descricao: b.dataset.descricao, versao: b.dataset.versao,
    atualizado_em: b.dataset.atualizado_em, registros: lista.length, licenca: b.dataset.licenca, url: rs.url, api_url: rs.api,
    downloads: { json: rs.json, jsonl: rs.jsonl, csv: rs.csv, schema: rs.schema },
    ...(b.dataset.doi ? { doi: b.dataset.doi } : {}),
    ...(b.dataset.huggingface ? { huggingface: b.dataset.huggingface } : {}),
  });
}
gravar(join(ND, 'dados', 'catalogo.json'), JSON.stringify(catalogo, null, 2) + '\n');
mkdirSync(join(ND, 'schemas'), { recursive: true });
for (const f of readdirSync(PASTA_SCHEMAS).filter((f) => f.endsWith('.json'))) copyFileSync(join(PASTA_SCHEMAS, f), join(ND, 'schemas', f));
if (existsSync(CAMINHO_SKILL)) gravar(join(ND, 'skill', 'SKILL.md'), readFileSync(CAMINHO_SKILL));

// 5. llms.txt e sitemap.
const L = T.LLMS;
const fmt = M.fmt;
const llms = [`# ${T.MARCA.nome}`, '', `> ${L.resumo}`, '', T.AVISO, '', `## ${L.bases}`, ''];
for (const rs of resumos) llms.push(`- [${rs.nome}](${rs.url}): ${fmt(L.linhaBase, rs)}`);
for (const [i, b] of bases.entries()) {
  llms.push('', `## ${fmt(L.registros, { nome: b.dataset.nome })}`, '');
  for (const r of listaPorBase.get(b.id).slice().sort((a, c) => a.nome.localeCompare(c.nome, 'pt-BR'))) {
    llms.push(`- [${r.sigla ? `${r.nome} (${r.sigla})` : r.nome}](${urlRegistro(b.id, r.slug)}): ${r.definicao}`);
  }
}
const enderecos = {
  api: `${URL_BASE}/api/v1`, openapi: `${URL_BASE}/api/v1/openapi.json`, mcp: `${URL_BASE}/mcp`, skill: `${URL_BASE}/skill/SKILL.md`,
  governanca: `${URL_BASE}/governanca`, metodologia: `${URL_BASE}/metodologia`, licencas: `${URL_BASE}/licencas`,
  github: SITE.github, huggingface: SITE.huggingface,
};
llms.push('', `## ${L.consultar}`, '');
for (const [r, v] of L.itensConsultar) llms.push(`- ${r}: ${fmt(v, enderecos)}`);
llms.push('', `## ${L.regras}`, '');
for (const [r, v] of L.itensRegras) llms.push(`- ${r}: ${fmt(v, enderecos)}`);
llms.push('', `## ${L.citar}`, '', L.citacao, '');
gravar(join(ND, 'llms.txt'), llms.join('\n'));

const xmlEsc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
gravar(join(ND, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${xmlEsc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`);

// 6. OpenAPI e os dados do Worker.
const E = Object.fromEntries(T.PAGINAS.documentacao.api.endpoints);
const MSG = T.MENSAGENS;
const resposta = { 200: { description: 'OK', content: { 'application/json': {} } } };
const openapi = {
  openapi: '3.1.0',
  info: { title: `${T.MARCA.nome} API`, version: '1', description: `${T.MARCA.lema} ${T.AVISO}`, license: { name: 'CC BY 4.0 (dados) e MIT (código)', url: `${URL_BASE}/licencas` } },
  servers: [{ url: `${URL_BASE}/api/v1` }],
  paths: {
    '/': { get: { summary: E['GET /api/v1'], responses: resposta } },
    '/bases': { get: { summary: E['GET /api/v1/bases'], responses: resposta } },
    '/openapi.json': { get: { summary: E['GET /api/v1/openapi.json'], responses: resposta } },
  },
};
for (const b of bases) {
  openapi.paths[`/${b.id}`] = {
    get: {
      summary: E['GET /api/v1/{base}'],
      parameters: [
        { name: 'q', in: 'query', schema: { type: 'string', maxLength: 100 }, description: MSG.parametroQ },
        { name: 'categoria', in: 'query', schema: { type: 'string', enum: Object.keys(T.CATEGORIAS[b.id] || {}) }, description: MSG.parametroCategoria },
        { name: 'pagina', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 }, description: MSG.parametroPagina },
        { name: 'por_pagina', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 }, description: MSG.parametroPorPagina },
      ],
      responses: { ...resposta, 400: { description: MSG.categoriaDesconhecida } },
    },
  };
  openapi.paths[`/${b.id}/{slug}`] = {
    get: {
      summary: E['GET /api/v1/{base}/{slug}'],
      parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' }, description: MSG.parametroSlug }],
      responses: { ...resposta, 404: { description: MSG.registroNaoEncontrado } },
    },
  };
}

const dadosWorker = {
  nome: T.MARCA.nome,
  prefixo: SITE.prefixo,
  urlBase: URL_BASE,
  versaoGerada: bases.map((b) => b.dataset.versao).sort().at(-1),
  aviso: T.AVISO,
  instrucoes: T.INSTRUCOES_MCP,
  ferramentas: T.FERRAMENTAS_MCP,
  mensagens: T.MENSAGENS,
  categorias: Object.keys(T.CATEGORIAS.neurobase),
  categoriasPorBase: Object.fromEntries(Object.entries(T.CATEGORIAS).map(([b, c]) => [b, Object.keys(c)])),
  temas: T.TEMAS,
  rotulos: T.REGISTRO,
  bases: catalogo.bases.map((c, i) => ({
    ...c, n: c.registros, api: c.api_url,
    citacao: M.fmt(c.doi ? T.PAGINAS.base.citacaoDoi : T.PAGINAS.base.citacao, { titulo: c.titulo, versao: c.versao, ano: c.atualizado_em.slice(0, 4), url: c.url, doi: c.doi || '' }),
  })),
  registros: registrosWorker,
  openapi,
};
gravar(join(RAIZ, 'worker', 'gerado', 'dados.mjs'), `// Gerado por scripts/construir.mjs${PUBLICAR ? ' --publicar' : ' (prévia)'}. Não editar à mão.\nexport const DADOS = ${JSON.stringify(dadosWorker, null, 1)};\n`);

const total = [...listaPorBase.values()].reduce((s, l) => s + l.length, 0);
console.log(`${PUBLICAR ? 'Publicação' : 'Prévia'} montada: ${sitemap.length} páginas no mapa do site, ${total} registro(s) nas bases, em dist/site e worker/gerado/dados.mjs.`);
