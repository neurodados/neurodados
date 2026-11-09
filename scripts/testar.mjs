// Testa o que foi montado (rode antes node scripts/construir.mjs): as páginas, os
// redirecionamentos, a API, o servidor MCP, os downloads, os links internos e os
// dados estruturados, pelo próprio Worker, com o ASSETS lendo de dist/site.
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

let falhas = 0;
let passou = 0;
const conferir = (cond, msg) => { if (cond) passou++; else { falhas++; console.log('FALHOU ' + msg); } };
const pedir = (caminho, opcoes = {}) => worker.fetch(new Request(ORIGEM + caminho, opcoes), env);
const mcp = async (corpo) => {
  const r = await pedir(P + '/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify(corpo) });
  return { status: r.status, corpo: r.status === 202 ? null : await r.json() };
};

// Páginas fixas
for (const c of ['', '/sobre', '/bases', '/governanca', '/metodologia', '/licencas', '/contribuicoes', '/documentacao', '/atualizacoes', '/bases/neurobase']) {
  const r = await pedir(P + c);
  conferir(r.status === 200 && r.headers.get('content-type').startsWith('text/html'), `página ${P + c}: ${r.status}`);
  conferir(!!r.headers.get('content-security-policy'), `CSP em ${P + c}`);
}
const registros = DADOS.registros.neurobase || [];
for (const reg of registros) {
  const r = await pedir(`${P}/bases/neurobase/${reg.slug}`);
  conferir(r.status === 200, `registro ${reg.slug}: ${r.status}`);
}
if (!registros.length) console.log('aviso: nenhum registro na base; os testes de registro ficaram de fora.');

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
conferir(r.status === 200 && j.dados.bases.length >= 1 && r.headers.get('access-control-allow-origin') === '*', 'API: índice e CORS');
r = await pedir(P + '/api/v1/bases');
j = await r.json();
conferir(j.dados[0].id === 'neurobase' && j.dados[0].registros === registros.length, 'API: catálogo');
r = await pedir(P + '/api/v1/neurobase?por_pagina=1000');
j = await r.json();
conferir(j.dados.total === registros.length && j.dados.por_pagina === 100 && j.versao_dos_dados && j.licenca && j.aviso && j.citar_como, 'API: lista, limite de 100 por página e envelope');
r = await pedir(P + '/api/v1/neurobase?categoria=inexistente');
conferir(r.status === 400, 'API: categoria desconhecida dá 400');
r = await pedir(P + '/api/v1/neurobase/nao-existe');
conferir(r.status === 404, 'API: registro que não existe dá 404');
r = await pedir(P + '/api/v2');
conferir(r.status === 404, 'API: versão que não existe dá 404');
r = await pedir(P + '/api/v1/neurobase', { method: 'POST' });
conferir(r.status === 405, 'API: POST dá 405');
r = await pedir(P + '/api/v1/neurobase', { method: 'OPTIONS' });
conferir(r.status === 204, 'API: OPTIONS dá 204');
r = await pedir(P + '/api/v1/openapi.json');
j = await r.json();
conferir(j.openapi === '3.1.0' && j.paths['/neurobase/{slug}'], 'API: OpenAPI');
if (registros.length) {
  const um = registros[0];
  r = await pedir(`${P}/api/v1/neurobase/${um.slug}`);
  j = await r.json();
  conferir(r.status === 200 && j.dados.id === um.id && j.dados.fontes.length >= 1, `API: registro ${um.slug}`);
  r = await pedir(`${P}/api/v1/neurobase/${um.id}`);
  conferir(r.status === 200, 'API: registro pelo id');
  r = await pedir(`${P}/api/v1/neurobase?q=${encodeURIComponent(um.nome)}`);
  j = await r.json();
  conferir(j.dados.registros[0]?.id === um.id, 'API: busca pelo nome acha o registro em 1º');
}
if (registros.some((x) => x.slug === 'tea')) {
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
conferir(m.corpo.result?.tools?.length === 5 && m.corpo.result.tools.every((t) => t.inputSchema && t.description), 'MCP: tools/list');
m = await mcp({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'listar_bases', arguments: {} } });
conferir(m.corpo.result?.content?.[0]?.text.includes('NeuroBase'), 'MCP: listar_bases');
m = await mcp({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'consultar_registro', arguments: { id: 'nao-existe' } } });
conferir(m.corpo.result?.isError === true, 'MCP: registro que não existe dá isError');
m = await mcp({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'buscar_conceito', arguments: {} } });
conferir(m.corpo.error?.code === -32602, 'MCP: busca sem consulta dá -32602');
m = await mcp({ jsonrpc: '2.0', id: 6, method: 'nada' });
conferir(m.corpo.error?.code === -32601, 'MCP: método desconhecido dá -32601');
m = await mcp([{ jsonrpc: '2.0', id: 7, method: 'ping' }, { jsonrpc: '2.0', method: 'notifications/initialized' }]);
conferir(Array.isArray(m.corpo) && m.corpo.length === 1 && m.corpo[0].id === 7, 'MCP: lote');
r = await pedir(P + '/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{quebrado' });
conferir(r.status === 400 && (await r.json()).error.code === -32700, 'MCP: JSON inválido dá -32700');
r = await pedir(P + '/mcp');
conferir(r.status === 405, 'MCP: GET dá 405');
if (registros.length) {
  const um = registros[0];
  m = await mcp({ jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'consultar_registro', arguments: { id: um.id } } });
  const texto = m.corpo.result?.content?.[0]?.text || '';
  conferir(!m.corpo.result?.isError && texto.includes(um.definicao) && texto.includes(um.fontes[0].url) && texto.includes(DADOS.aviso), 'MCP: consultar_registro traz definição, fonte e aviso');
  m = await mcp({ jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name: 'buscar_conceito', arguments: { consulta: um.nome } } });
  conferir(m.corpo.result?.structuredContent?.registros?.[0]?.id === um.id, 'MCP: buscar_conceito acha pelo nome');
}

// Downloads
r = await pedir(P + '/dados/neurobase.json');
conferir(r.headers.get('content-type').startsWith('application/json') && (await r.json()).length === registros.length, 'download JSON');
r = await pedir(P + '/dados/neurobase.jsonl');
conferir(r.headers.get('content-type').startsWith('application/x-ndjson'), 'download JSONL: tipo');
r = await pedir(P + '/dados/neurobase.csv');
const csv = await r.text();
conferir(r.headers.get('content-type').startsWith('text/csv') && csv.replace(/^﻿/, '').startsWith('id,slug,nome'), 'download CSV');
r = await pedir(P + '/llms.txt');
conferir(r.status === 200 && (await r.text()).startsWith('# NeuroDados Brasil'), 'llms.txt');
r = await pedir(P + '/sitemap.xml');
conferir(r.status === 200 && (await r.text()).includes('<urlset'), 'sitemap.xml');
r = await pedir(P + '/estilo.css?v=1');
conferir((r.headers.get('cache-control') || '').includes('immutable'), 'CSS com ?v= fica em cache longo');

// Varredura das páginas: links internos, dados estruturados e regras de texto.
function* arquivos(pasta) {
  for (const f of readdirSync(pasta)) {
    const c = join(pasta, f);
    if (statSync(c).isDirectory()) yield* arquivos(c); else yield c;
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

console.log(`\n${passou} conferências passaram, ${falhas} falharam (${links.size} links internos).`);
process.exit(falhas ? 1 : 0);
