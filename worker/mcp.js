// Servidor MCP do NeuroDados: /neurodados/mcp, transporte HTTP do protocolo,
// sem sessão e sem autenticação. Só leitura. Cada resposta traz as fontes, a
// versão dos dados e a situação da revisão. Os textos vêm de portal/textos.mjs.

import { buscar, registroPorChave, resumo } from './busca.js';

const VERSOES = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
  'X-Content-Type-Options': 'nosniff',
};

const fmt = (modelo, vars) => modelo.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

function json(dados, status = 200, extra = {}) {
  return new Response(JSON.stringify(dados), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS, ...extra } });
}
const ok = (id, result) => ({ jsonrpc: '2.0', id, result });
const erro = (id, code, message, data) => ({ jsonrpc: '2.0', id, error: data ? { code, message, data } : { code, message } });

function definicoes(D) {
  const F = D.ferramentas;
  const M = D.mensagens;
  const leitura = (title) => ({ title, readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false });
  const vazio = { type: 'object', properties: {}, additionalProperties: false };
  return [
    { name: 'listar_bases', title: 'listar_bases', description: F.listar_bases, inputSchema: vazio, annotations: leitura('listar_bases') },
    {
      name: 'buscar_conceito', title: 'buscar_conceito', description: F.buscar_conceito,
      inputSchema: {
        type: 'object', additionalProperties: false, required: ['consulta'],
        properties: {
          consulta: { type: 'string', maxLength: 100, description: M.parametroConsulta },
          categoria: { type: 'string', enum: D.categorias, description: M.parametroCategoria },
          limite: { type: 'integer', minimum: 1, maximum: 20, default: 5, description: M.parametroLimite },
        },
      },
      annotations: leitura('buscar_conceito'),
    },
    {
      name: 'consultar_registro', title: 'consultar_registro', description: F.consultar_registro,
      inputSchema: { type: 'object', additionalProperties: false, required: ['id'], properties: { id: { type: 'string', description: M.parametroId } } },
      annotations: leitura('consultar_registro'),
    },
    { name: 'consultar_tea', title: 'consultar_tea', description: F.consultar_tea, inputSchema: vazio, annotations: leitura('consultar_tea') },
    { name: 'consultar_tdah', title: 'consultar_tdah', description: F.consultar_tdah, inputSchema: vazio, annotations: leitura('consultar_tdah') },
  ];
}

function situacao(D, r) {
  const M = D.mensagens;
  const rev = r.revisao;
  const revisor = rev.revisores?.at(-1);
  if (rev.situacao === 'revisado' && revisor) return fmt(M.mcpRevisado, revisor);
  if (rev.situacao === 'em_revisao') return fmt(M.mcpEmRevisao, { data: rev.conferido_em });
  return fmt(M.mcpConferido, { data: rev.conferido_em });
}

function textoRegistro(D, base, r) {
  const L = D.rotulos;
  const M = D.mensagens;
  const ordem = new Map(r.fontes.map((f, i) => [f.id, i + 1]));
  const linhas = [`${r.sigla ? `${r.nome} (${r.sigla})` : r.nome} [${r.id}]`, `${L.definicao}: ${r.definicao}`];
  if (r.nomes_alternativos?.length) linhas.push(`${L.nomesAlternativos}: ${r.nomes_alternativos.join(', ')}`);
  linhas.push('', `${L.afirmacoes}:`);
  for (const a of r.afirmacoes) linhas.push(`- ${a.texto} ${a.fontes.map((f) => `[${ordem.get(f)}]`).join('')}`);
  if (r.classificacoes?.length) {
    linhas.push('', `${L.classificacoes}:`);
    for (const c of r.classificacoes) linhas.push(`- ${c.sistema} ${c.codigo}: ${c.titulo} [${ordem.get(c.fonte)}]`);
  }
  linhas.push('', `${L.limitacoes}:`);
  for (const l of r.limitacoes) linhas.push(`- ${l}`);
  linhas.push('', `${L.fontes}:`);
  r.fontes.forEach((f, i) => linhas.push(`[${i + 1}] ${f.titulo}. ${f.autor}, ${f.ano}.${f.referencia ? ` ${f.referencia}.` : ''} ${f.url} (${f.consultado_em})`));
  linhas.push(
    '',
    `${L.situacao}: ${situacao(D, r)}. ${fmt(M.mcpVersaoRegistro, { versao: r.versao, data: r.atualizado_em })}`,
    fmt(M.mcpEndereco, { url: r.url }),
    fmt(M.mcpVersaoBase, { versao: base.versao, licenca: base.licenca.sigla }),
    `${L.citar}: ${base.citacao}`,
    '',
    D.aviso,
  );
  return linhas.join('\n');
}

function resultado(texto, estruturado, isError = false) {
  return { content: [{ type: 'text', text: texto }], structuredContent: estruturado, isError };
}

function chamar(m, D) {
  const M = D.mensagens;
  const nome = m.params?.name;
  const args = m.params?.arguments || {};
  const base = D.bases.find((b) => b.id === 'neurobase');
  const lista = D.registros.neurobase || [];
  const umRegistro = (chave) => {
    const r = registroPorChave(lista, 'neurobase', chave || '');
    if (!r) return resultado(fmt(M.mcpSemRegistro, { chave }), { encontrado: false }, true);
    return resultado(textoRegistro(D, base, r), { fonte: M.fonte, versao_dos_dados: base.versao, licenca: base.licenca, aviso: D.aviso, registro: r });
  };
  switch (nome) {
    case 'listar_bases': {
      const bases = D.bases.map((b) => ({ id: b.id, nome: b.nome, titulo: b.titulo, versao: b.versao, n: b.n, url: b.url, api_url: b.api }));
      const texto = bases.map((b) => fmt(M.mcpBase, b)).join('\n') + `\n\n${D.aviso}`;
      return ok(m.id, resultado(texto, { fonte: M.fonte, bases }));
    }
    case 'buscar_conceito': {
      if (typeof args.consulta !== 'string' || !args.consulta.trim()) return erro(m.id, -32602, M.mcpInformeConsulta);
      if (args.categoria && !D.categorias.includes(args.categoria)) return erro(m.id, -32602, M.categoriaDesconhecida, { categorias: D.categorias });
      const limite = Math.min(20, Math.max(1, parseInt(args.limite || 5, 10) || 5));
      const consulta = args.consulta.slice(0, 100);
      const achados = buscar(lista, consulta, { categoria: args.categoria });
      const registros = achados.slice(0, limite).map(resumo);
      const texto = registros.length
        ? registros.map((r) => `${r.nome}${r.sigla ? ` (${r.sigla})` : ''} [${r.id}]: ${r.definicao} ${r.url}`).join('\n')
          + `\n\n${fmt(M.mcpVersaoBase, { versao: base.versao, licenca: base.licenca.sigla })} ${M.mcpDicaFontes}\n${D.aviso}`
        : fmt(M.mcpSemResultado, { consulta, url: base.url });
      return ok(m.id, resultado(texto, { consulta, total: achados.length, versao_dos_dados: base.versao, registros }));
    }
    case 'consultar_registro':
      if (typeof args.id !== 'string' || !args.id.trim()) return erro(m.id, -32602, M.mcpInformeId);
      return ok(m.id, umRegistro(args.id));
    case 'consultar_tea': return ok(m.id, umRegistro('tea'));
    case 'consultar_tdah': return ok(m.id, umRegistro('tdah'));
    default: return erro(m.id, -32602, fmt(M.mcpFerramenta, { nome }));
  }
}

function tratar(m, D) {
  if (!m || typeof m !== 'object' || m.jsonrpc !== '2.0') return erro(m?.id ?? null, -32600, 'Invalid Request');
  if (!('id' in m)) return null; // notificação, como notifications/initialized: só se aceita
  if (typeof m.method !== 'string') return erro(m.id, -32600, 'Invalid Request');
  switch (m.method) {
    case 'initialize': {
      const pedida = m.params?.protocolVersion;
      return ok(m.id, {
        protocolVersion: VERSOES.includes(pedida) ? pedida : VERSOES[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'neurodados', title: D.nome, version: D.versaoGerada },
        instructions: D.instrucoes,
      });
    }
    case 'ping': return ok(m.id, {});
    case 'tools/list': return ok(m.id, { tools: definicoes(D) });
    case 'tools/call': return chamar(m, D);
    default: return erro(m.id, -32601, `Method not found: ${m.method}`);
  }
}

export async function responderMcp(request, D) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') {
    return json({ nome: D.nome, mensagem: D.mensagens.mcpGet, documentacao: D.urlBase + '/documentacao' }, 405, { Allow: 'POST, OPTIONS' });
  }
  let corpo;
  try { corpo = await request.json(); } catch { return json(erro(null, -32700, 'Parse error'), 400); }
  const lote = Array.isArray(corpo);
  const mensagens = lote ? corpo : [corpo];
  if (!mensagens.length) return json(erro(null, -32600, 'Invalid Request'), 400);
  const respostas = mensagens.map((m) => tratar(m, D)).filter(Boolean);
  if (!respostas.length) return new Response(null, { status: 202, headers: CORS });
  return json(lote ? respostas : respostas[0]);
}
