// Testa o que foi montado (rode antes node scripts/construir.mjs): as páginas, os
// redirecionamentos, a API, o servidor MCP, os downloads, os links internos e os
// dados estruturados, pelo próprio Worker, com o ASSETS lendo de dist/site.
// Vale para todas as bases que a montagem publicou.
// Uso: node scripts/testar.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ambienteLocal, origemFalsa, carregarWorker, DIST_SITE } from './lib/ambiente.mjs';
import { errosDeTexto } from './lib/dados.mjs';

origemFalsa();
const worker = await carregarWorker();
const { DADOS } = await import('../worker/gerado/dados.mjs');
const env = ambienteLocal();
const ORIGEM = 'https://clinicaneurobee.com.br';
const P = DADOS.prefixo;
const BASES = DADOS.bases.map((b) => b.id);

let falhas = 0;
let passou = 0;
const conferir = (cond, msg) => { if (cond) passou++; else { falhas++; console.log('FALHOU ' + msg); } };
const pedir = (caminho, opcoes = {}) => worker.fetch(new Request(ORIGEM + caminho, opcoes), env);
const mcp = async (corpo) => {
  const r = await pedir(P + '/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify(corpo) });
  return { status: r.status, corpo: r.status === 202 ? null : await r.json() };
};
const chamar = async (name, args = {}, id = 99) => (await mcp({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } })).corpo;

// Páginas fixas e de cada base
for (const c of ['', '/sobre', '/bases', '/governanca', '/metodologia', '/licencas', '/contribuicoes', '/documentacao', '/atualizacoes', ...BASES.map((b) => `/bases/${b}`)]) {
  const r = await pedir(P + c);
  conferir(r.status === 200 && r.headers.get('content-type').startsWith('text/html'), `página ${P + c}: ${r.status}`);
  conferir(!!r.headers.get('content-security-policy'), `CSP em ${P + c}`);
}
for (const b of BASES) {
  for (const reg of DADOS.registros[b] || []) {
    const r = await pedir(`${P}/bases/${b}/${reg.slug}`);
    conferir(r.status === 200, `registro ${b}/${reg.slug}: ${r.status}`);
  }
}

// Redirecionamentos, 404 e o que não é do NeuroDados
let r = await pedir(P + '/');
conferir(r.status === 301 && r.headers.get('location') === ORIGEM + P, '/neurodados/ vai para /neurodados');
r = await pedir(P + '/sobre/');
conferir(r.status === 301 && r.headers.get('location') === ORIGEM + P + '/sobre', '/sobre/ vai para /sobre');
r = await pedir(P + '/nao-existe');
conferir(r.status === 404 && (await r.text()).includes('Página não encontrada'), '404 com a página própria');
r = await pedir('/neurodadosx');
conferir(r.headers.get('x-origem') === 'site', '/neurodadosx segue para o site');
r = await pedir('/contato');
conferir(r.headers.get('x-origem') === 'site', '/contato segue para o site');
r = await pedir(P, { method: 'POST' });
conferir(r.status === 405, 'POST em página: 405');
r = await pedir(P + '/api');
conferir(r.status === 301 && r.headers.get('location').endsWith('/api/v1'), '/api vai para /api/v1');

// API
r = await pedir(P + '/api/v1');
let j = await r.json();
conferir(r.status === 200 && j.dados.bases.length === BASES.length && r.headers.get('access-control-allow-origin') === '*', 'API: índice e CORS');
r = await pedir(P + '/api/v1/bases');
j = await r.json();
conferir(JSON.stringify(j.dados.map((b) => b.id)) === JSON.stringify(BASES) && j.dados.every((b) => b.registros === (DADOS.registros[b.id] || []).length), 'API: catálogo, na ordem e com as contagens');
for (const b of BASES) {
  const lista = DADOS.registros[b] || [];
  r = await pedir(`${P}/api/v1/${b}?por_pagina=1000`);
  j = await r.json();
  conferir(j.dados.total === lista.length && j.dados.por_pagina === 100 && j.versao_dos_dados && j.licenca && j.aviso && j.citar_como, `API: lista da ${b}, limite de 100 e envelope`);
  if (lista.length) {
    const um = lista[0];
    r = await pedir(`${P}/api/v1/${b}/${um.slug}`);
    j = await r.json();
    conferir(r.status === 200 && j.dados.id === um.id && j.dados.fontes.length >= 1, `API: registro ${um.id}`);
    r = await pedir(`${P}/api/v1/${b}?q=${encodeURIComponent(um.nome)}`);
    j = await r.json();
    conferir(j.dados.registros[0]?.id === um.id, `API: busca pelo nome acha ${um.id} em 1º`);
  }
}
r = await pedir(P + '/api/v1/neurobase?categoria=inexistente');
conferir(r.status === 400, 'API: categoria desconhecida dá 400');
r = await pedir(P + '/api/v1/neurobase/nao-existe');
conferir(r.status === 404, 'API: registro que não existe dá 404');
r = await pedir(P + '/api/v1/v2');
conferir(r.status === 404, 'API: endereço que não existe dá 404');
r = await pedir(P + '/api/v2');
conferir(r.status === 404, 'API: versão que não existe dá 404');
r = await pedir(P + '/api/v1/neurobase', { method: 'POST' });
conferir(r.status === 405, 'API: POST dá 405');
r = await pedir(P + '/api/v1/neurobase', { method: 'OPTIONS' });
conferir(r.status === 204, 'API: OPTIONS dá 204');
r = await pedir(P + '/api/v1/openapi.json');
j = await r.json();
conferir(j.openapi === '3.1.0' && BASES.every((b) => j.paths[`/${b}/{slug}`]), 'API: OpenAPI com todas as bases');
if ((DADOS.registros.neurobase || []).some((x) => x.slug === 'tea')) {
  r = await pedir(P + '/api/v1/neurobase?q=autismo');
  j = await r.json();
  conferir(j.dados.registros.some((x) => x.id === 'neurobase.tea'), 'API: "autismo" acha o TEA');
}

// MCP
let m = await mcp({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'teste', version: '1' } } });
conferir(m.corpo.result?.protocolVersion === '2025-06-18' && m.corpo.result.capabilities.tools, 'MCP: initialize');
m = await mcp({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '1999-01-01' } });
conferir(m.corpo.result?.protocolVersion === '2025-11-25', 'MCP: versão desconhecida recebe a mais nova');
m = await mcp({ jsonrpc: '2.0', method: 'notifications/initialized' });
conferir(m.status === 202, 'MCP: notificação dá 202');
m = await mcp({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
const temInstrumento = (DADOS.registros.avaliabase || []).some((x) => x.categoria === 'instrumento');
const busca = { neurobase: ['buscar_conceito'], avaliabase: ['buscar_avaliacao', ...(temInstrumento ? ['buscar_instrumento'] : [])], intervenbase: ['buscar_intervencao'], evidenciabase: ['buscar_evidencias'], neurodireitos: ['buscar_norma'] };
const esperadas = ['listar_bases', ...BASES.flatMap((b) => busca[b] || []), 'consultar_registro', ...(BASES.includes('neurobase') ? ['consultar_tea', 'consultar_tdah'] : [])];
const nomes = (m.corpo.result?.tools || []).map((t) => t.name);
conferir(JSON.stringify(nomes.slice().sort()) === JSON.stringify(esperadas.slice().sort()) && m.corpo.result.tools.every((t) => t.inputSchema && t.description), `MCP: tools/list (${nomes.join(', ')})`);
let c = await chamar('listar_bases', {}, 3);
conferir(BASES.every((b) => c.result?.content?.[0]?.text.includes(DADOS.bases.find((x) => x.id === b).nome)), 'MCP: listar_bases');
c = await chamar('consultar_registro', { id: 'nao-existe' }, 4);
conferir(c.result?.isError === true, 'MCP: registro que não existe dá isError');
c = await chamar('buscar_conceito', {}, 5);
conferir(c.error?.code === -32602, 'MCP: busca sem consulta dá -32602');
m = await mcp({ jsonrpc: '2.0', id: 6, method: 'nada' });
conferir(m.corpo.error?.code === -32601, 'MCP: método desconhecido dá -32601');
m = await mcp([{ jsonrpc: '2.0', id: 7, method: 'ping' }, { jsonrpc: '2.0', method: 'notifications/initialized' }]);
conferir(Array.isArray(m.corpo) && m.corpo.length === 1 && m.corpo[0].id === 7, 'MCP: lote');
r = await pedir(P + '/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{quebrado' });
conferir(r.status === 400 && (await r.json()).error.code === -32700, 'MCP: JSON inválido dá -32700');
r = await pedir(P + '/mcp');
conferir(r.status === 405, 'MCP: GET dá 405');
for (const b of BASES) {
  const lista = DADOS.registros[b] || [];
  if (!lista.length) continue;
  const um = lista[0];
  c = await chamar('consultar_registro', { id: um.id }, 8);
  const texto = c.result?.content?.[0]?.text || '';
  conferir(!c.result?.isError && texto.includes(um.definicao) && texto.includes(um.fontes[0].url) && texto.includes(DADOS.aviso), `MCP: consultar_registro ${um.id} traz o texto, a fonte e o aviso`);
  const ferramenta = busca[b][0];
  c = await chamar(ferramenta, { consulta: um.nome }, 9);
  conferir(c.result?.structuredContent?.registros?.[0]?.id === um.id, `MCP: ${ferramenta} acha ${um.id} pelo nome`);
}
const instrumentos = (DADOS.registros.avaliabase || []).filter((x) => x.categoria === 'instrumento');
if (instrumentos.length) {
  const i = instrumentos[0];
  c = await chamar('buscar_instrumento', { consulta: i.sigla || i.nome }, 10);
  conferir(c.result?.structuredContent?.registros?.[0]?.id === i.id && c.result.content[0].text.includes('SATEPSI'), `MCP: buscar_instrumento acha ${i.id} com a situação no SATEPSI`);
}
// NeuroDireitos: busca pelo número da norma, filtros e a ficha com o texto oficial.
const normas = DADOS.registros.neurodireitos || [];
if (normas.length) {
  const n = normas[0];
  const oficial = n.fontes.find((f) => f.id === n.norma.fonte).url;
  c = await chamar('buscar_norma', { consulta: n.norma.numero.replace(/\./g, '') }, 11);
  conferir(c.result?.structuredContent?.registros?.[0]?.id === n.id && c.result.content[0].text.includes(oficial), `MCP: buscar_norma acha ${n.id} pelo número, com o texto oficial`);
  const cond = (n.condicoes || [])[0];
  if (cond) {
    c = await chamar('buscar_norma', { consulta: n.nome, condicao: cond }, 12);
    conferir((c.result?.structuredContent?.registros || []).some((x) => x.id === n.id), `MCP: buscar_norma filtra pela condição (${cond})`);
  }
  c = await chamar('buscar_norma', { consulta: 'lei', condicao: 'nao-existe' }, 13);
  conferir(c.error?.code === -32602, 'MCP: buscar_norma com condição desconhecida dá -32602');
  c = await chamar('consultar_registro', { id: n.id }, 14);
  conferir((c.result?.content?.[0]?.text || '').includes(DADOS.rotulos.norma.titulo), `MCP: consultar_registro ${n.id} traz a ficha da norma`);
  r = await pedir(`${P}/api/v1/neurodireitos?area=nao-existe`);
  conferir(r.status === 400, 'API: área desconhecida no NeuroDireitos dá 400');
  if (cond) {
    r = await pedir(`${P}/api/v1/neurodireitos?condicao=${cond}`);
    const j = await r.json();
    conferir(r.status === 200 && (j.dados?.registros || []).every((x) => (x.condicoes || []).includes(cond)), `API: filtro condicao=${cond} no NeuroDireitos`);
  }
  // Abrangência e estado (UF): normas federais, estaduais e municipais.
  r = await pedir(`${P}/api/v1/neurodireitos?abrangencia=nao-existe`);
  conferir(r.status === 400, 'API: abrangência desconhecida no NeuroDireitos dá 400');
  r = await pedir(`${P}/api/v1/neurodireitos?uf=r1`);
  conferir(r.status === 400, 'API: UF inválida no NeuroDireitos dá 400');
  for (const ab of [...new Set(normas.map((x) => x.norma.abrangencia))]) {
    r = await pedir(`${P}/api/v1/neurodireitos?abrangencia=${ab}&por_pagina=100`);
    const ja = await r.json();
    const esperado = normas.filter((x) => x.norma.abrangencia === ab).length;
    conferir(r.status === 200 && ja.dados.total === esperado && ja.dados.registros.every((x) => x.norma.abrangencia === ab), `API: filtro abrangencia=${ab} no NeuroDireitos (${esperado})`);
  }
  for (const uf of [...new Set(normas.map((x) => x.norma.uf).filter(Boolean))]) {
    r = await pedir(`${P}/api/v1/neurodireitos?uf=${uf.toLowerCase()}&por_pagina=100`);
    const ju = await r.json();
    const esperado = normas.filter((x) => x.norma.uf === uf).length;
    conferir(r.status === 200 && ju.dados.total === esperado && ju.dados.registros.every((x) => x.norma.uf === uf), `API: filtro uf=${uf} no NeuroDireitos (${esperado})`);
    c = await chamar('buscar_norma', { consulta: 'lei', uf }, 16);
    conferir(!c.error && (c.result?.structuredContent?.registros || []).every((x) => x.norma.uf === uf), `MCP: buscar_norma filtra pela UF (${uf})`);
    r = await pedir(`${P}/bases/neurodireitos`);
    conferir((await r.text()).includes('<div class="jurisdicao"><h3>'), 'página do NeuroDireitos agrupa as normas por lugar');
  }
  c = await chamar('buscar_norma', { consulta: 'lei', abrangencia: 'nao-existe' }, 15);
  conferir(c.error?.code === -32602, 'MCP: buscar_norma com abrangência desconhecida dá -32602');
}

// Downloads de cada base
for (const b of BASES) {
  const n = (DADOS.registros[b] || []).length;
  r = await pedir(`${P}/dados/${b}.json`);
  conferir(r.headers.get('content-type').startsWith('application/json') && (await r.json()).length === n, `download JSON da ${b}`);
  r = await pedir(`${P}/dados/${b}.jsonl`);
  conferir(r.headers.get('content-type').startsWith('application/x-ndjson'), `download JSONL da ${b}: tipo`);
  r = await pedir(`${P}/dados/${b}.csv`);
  const csv = await r.text();
  conferir(r.headers.get('content-type').startsWith('text/csv') && csv.replace(/^﻿/, '').startsWith('id,slug,nome'), `download CSV da ${b}`);
}
r = await pedir(P + '/llms.txt');
conferir(r.status === 200 && (await r.text()).startsWith('# NeuroDados Brasil'), 'llms.txt');
r = await pedir(P + '/sitemap.xml');
conferir(r.status === 200 && (await r.text()).includes('<urlset'), 'sitemap.xml');
r = await pedir(P + '/estilo.css?v=1');
conferir((r.headers.get('cache-control') || '').includes('immutable'), 'CSS com ?v= fica em cache longo');

// Varredura das páginas: links internos, dados estruturados e regras de texto.
function* arquivos(pasta) {
  for (const f of readdirSync(pasta)) {
    const caminho = join(pasta, f);
    if (statSync(caminho).isDirectory()) yield* arquivos(caminho); else yield caminho;
  }
}
const links = new Set();
for (const arquivo of arquivos(DIST_SITE)) {
  if (!arquivo.endsWith('.html')) continue;
  const html = readFileSync(arquivo, 'utf8');
  const nome = relative(DIST_SITE, arquivo);
  for (const [, bruto] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const h = bruto.replace(/&amp;/g, '&');
    if (h.startsWith(P)) links.add(h.split('#')[0]);
    else if (h.startsWith(ORIGEM + P)) links.add(h.slice(ORIGEM.length).split('#')[0]);
  }
  for (const [, bloco] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(bloco); passou++; } catch { conferir(false, `JSON-LD inválido em ${nome}`); }
  }
  // O que é literal da fonte (lista de fontes e tabelas) fica de fora das regras de texto.
  const visivel = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<ol class="fontes">[\s\S]*?<\/ol>/g, '')
    .replace(/<table>[\s\S]*?<\/table>/g, '')
    .replace(/<[^>]+>/g, ' ');
  for (const e of errosDeTexto(visivel)) conferir(false, `${e} no texto de ${nome}`);
}
for (const l of links) {
  const resp = await pedir(l);
  conferir(resp.status === 200, `link interno ${l}: ${resp.status}`);
}

console.log(`\n${passou} conferências passaram, ${falhas} falharam (${links.size} links internos, bases: ${BASES.join(', ')}).`);
process.exit(falhas ? 1 : 0);
