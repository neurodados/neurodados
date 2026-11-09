// Servidor MCP do NeuroDados: /neurodados/mcp, transporte HTTP do protocolo,
// sem sessão e sem autenticação. Só leitura. Cada resposta traz as fontes, a
// versão dos dados e a situação da revisão. Os textos vêm de portal/textos.mjs.
// As ferramentas de uma base só aparecem quando a base está publicada.

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

// Ferramenta de busca: em que base procura e com que filtro fixo.
const BUSCAS = {
  buscar_conceito: { base: 'neurobase' },
  buscar_avaliacao: { base: 'avaliabase' },
  buscar_instrumento: { base: 'avaliabase', categoria: 'instrumento' },
  buscar_intervencao: { base: 'intervenbase' },
  buscar_evidencias: { base: 'evidenciabase' },
};

const temBase = (D, id) => D.bases.some((b) => b.id === id);
// Busca com categoria fixa (os instrumentos) só aparece quando a base já tem registro dela.
const temCategoria = (D, base, categoria) => (D.registros[base] || []).some((r) => r.categoria === categoria);

function definicoes(D) {
  const F = D.ferramentas;
  const M = D.mensagens;
  const leitura = (title) => ({ title, readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false });
  const vazio = { type: 'object', properties: {}, additionalProperties: false };
  const limite = { type: 'integer', minimum: 1, maximum: 20, default: 5, description: M.parametroLimite };
  const lista = [{ name: 'listar_bases', title: 'listar_bases', description: F.listar_bases, inputSchema: vazio, annotations: leitura('listar_bases') }];
  for (const [nome, b] of Object.entries(BUSCAS)) {
    if (!temBase(D, b.base)) continue;
    if (b.categoria && !temCategoria(D, b.base, b.categoria)) continue;
    const props = { consulta: { type: 'string', maxLength: 100, description: M.parametroConsulta }, limite };
    if (!b.categoria) props.categoria = { type: 'string', enum: D.categoriasPorBase[b.base] || [], description: M.parametroCategoria };
    if (b.base === 'evidenciabase') props.tema = { type: 'string', enum: Object.keys(D.temas || {}), description: M.parametroTema || M.parametroCategoria };
    lista.push({ name: nome, title: nome, description: F[nome], inputSchema: { type: 'object', additionalProperties: false, required: ['consulta'], properties: props }, annotations: leitura(nome) });
  }
  lista.push({
    name: 'consultar_registro', title: 'consultar_registro', description: F.consultar_registro,
    inputSchema: { type: 'object', additionalProperties: false, required: ['id'], properties: { id: { type: 'string', description: M.parametroId } } },
    annotations: leitura('consultar_registro'),
  });
  if (temBase(D, 'neurobase')) {
    lista.push({ name: 'consultar_tea', title: 'consultar_tea', description: F.consultar_tea, inputSchema: vazio, annotations: leitura('consultar_tea') });
    lista.push({ name: 'consultar_tdah', title: 'consultar_tdah', description: F.consultar_tdah, inputSchema: vazio, annotations: leitura('consultar_tdah') });
  }
  return lista;
}

function situacao(D, r) {
  const M = D.mensagens;
  const rev = r.revisao;
  const revisor = rev.revisores?.at(-1);
  if (rev.situacao === 'revisado' && revisor) return fmt(M.mcpRevisado, revisor);
  if (rev.situacao === 'em_revisao') return fmt(M.mcpEmRevisao, { data: rev.conferido_em });
  return fmt(M.mcpConferido, { data: rev.conferido_em });
}

function linhaSatepsi(D, s) {
  const I = D.rotulos.instrumento;
  return [I.situacoes[s.situacao], s.normas_validas_ate ? fmt(I.normas, { data: s.normas_validas_ate }) : '', fmt(I.consulta, { data: s.consultado_em })].filter(Boolean).join(', ');
}

function textoRegistro(D, base, r) {
  const L = D.rotulos;
  const M = D.mensagens;
  const evidencia = base.id === 'evidenciabase';
  const ordem = new Map(r.fontes.map((f, i) => [f.id, i + 1]));
  const ref = (ids) => ids.map((f) => `[${ordem.get(f)}]`).join('');
  const linhas = [`${r.sigla ? `${r.nome} (${r.sigla})` : r.nome} [${r.id}]`, `${evidencia ? L.resumo : L.definicao}: ${r.definicao}`];
  if (r.nomes_alternativos?.length) linhas.push(`${L.nomesAlternativos}: ${r.nomes_alternativos.join(', ')}`);
  if (r.faixa_etaria?.descricao && !r.instrumento) linhas.push(`${L.faixaEtaria}: ${r.faixa_etaria.descricao}`);
  if (r.publicacao) {
    const P = L.publicacao;
    const p = r.publicacao;
    linhas.push('', `${P.titulo}:`, `- ${P.tituloOriginal}: ${p.titulo_original}`, `- ${P.autores}: ${p.autores.join('; ')}`, `- ${P.ano}: ${p.ano}`, `- ${P.veiculo}: ${p.veiculo}`);
    if (P.tipos?.[r.categoria]) linhas.push(`- ${P.tipo}: ${P.tipos[r.categoria]}`);
    if (p.doi) linhas.push(`- DOI: https://doi.org/${p.doi}`);
    if (r.populacao) linhas.push(`- ${P.populacao}: ${r.populacao}`);
    if (r.metodo) linhas.push(`- ${P.metodo}: ${r.metodo}`);
  }
  if (r.instrumento) {
    const I = L.instrumento;
    const i = r.instrumento;
    linhas.push('', `${I.titulo}:`);
    if (i.nome_original) linhas.push(`- ${I.nomeOriginal}: ${i.nome_original}`);
    linhas.push(`- ${I.construtos}: ${i.construtos.join('; ')}`);
    if (i.faixa_etaria?.descricao) linhas.push(`- ${L.faixaEtaria}: ${i.faixa_etaria.descricao}`);
    linhas.push(`- ${I.uso}: ${I.usos[i.uso]}`, `- ${I.satepsi}: ${linhaSatepsi(D, i.satepsi)} ${ref([i.satepsi.fonte])}`, I.aviso);
  }
  const I2 = L.intervencao;
  if (r.objetivos?.length) linhas.push('', `${I2.objetivos}:`, ...r.objetivos.map((o) => `- ${o}`));
  if (r.publico) linhas.push('', `${I2.publico}: ${r.publico}`);
  if (r.contextos?.length) linhas.push('', `${I2.contextos}: ${r.contextos.join('; ')}`);
  if (r.profissionais?.length) linhas.push(`${I2.profissionais}: ${r.profissionais.join('; ')}`);
  linhas.push('', `${evidencia ? L.resultados : L.afirmacoes}:`);
  for (const a of r.afirmacoes) linhas.push(`- ${a.texto} ${ref(a.fontes)}`);
  if (r.classificacoes?.length) {
    linhas.push('', `${L.classificacoes}:`);
    for (const c of r.classificacoes) linhas.push(`- ${c.sistema} ${c.codigo}: ${c.titulo} ${ref([c.fonte])}`);
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

// "avaliabase.satepsi" procura na AvaliaBase; "tea", sem prefixo, na NeuroBase.
function acharRegistro(D, chave) {
  const k = String(chave || '').trim().toLowerCase();
  const prefixo = k.includes('.') ? k.split('.')[0] : '';
  const base = D.bases.find((b) => b.id === prefixo) || D.bases.find((b) => b.id === 'neurobase');
  if (!base) return null;
  const r = registroPorChave(D.registros[base.id] || [], base.id, k);
  return r ? { base, r } : null;
}

function chamar(m, D) {
  const M = D.mensagens;
  const nome = m.params?.name;
  const args = m.params?.arguments || {};
  const umRegistro = (chave) => {
    const achado = acharRegistro(D, chave);
    if (!achado) return resultado(fmt(M.mcpSemRegistro, { chave }), { encontrado: false }, true);
    const { base, r } = achado;
    return resultado(textoRegistro(D, base, r), { fonte: M.fonte, base: base.id, versao_dos_dados: base.versao, licenca: base.licenca, aviso: D.aviso, registro: r });
  };
  if (nome === 'listar_bases') {
    const bases = D.bases.map((b) => ({ id: b.id, nome: b.nome, titulo: b.titulo, versao: b.versao, n: b.n, url: b.url, api_url: b.api }));
    const texto = bases.map((b) => fmt(M.mcpBase, b)).join('\n') + `\n\n${D.aviso}`;
    return ok(m.id, resultado(texto, { fonte: M.fonte, bases }));
  }
  if (BUSCAS[nome] && temBase(D, BUSCAS[nome].base)) {
    const def = BUSCAS[nome];
    const base = D.bases.find((b) => b.id === def.base);
    if (typeof args.consulta !== 'string' || !args.consulta.trim()) return erro(m.id, -32602, M.mcpInformeConsulta);
    const categorias = D.categoriasPorBase[def.base] || [];
    if (args.categoria && !categorias.includes(args.categoria)) return erro(m.id, -32602, M.categoriaDesconhecida, { categorias });
    if (args.tema && !Object.keys(D.temas || {}).includes(args.tema)) return erro(m.id, -32602, M.categoriaDesconhecida, { temas: Object.keys(D.temas || {}) });
    const limite = Math.min(20, Math.max(1, parseInt(args.limite || 5, 10) || 5));
    const consulta = args.consulta.slice(0, 100);
    let achados = buscar(D.registros[def.base] || [], consulta, { categoria: def.categoria || args.categoria });
    if (args.tema) achados = achados.filter((r) => (r.temas || []).includes(args.tema));
    const registros = achados.slice(0, limite).map(resumo);
    const linha = (r) => {
      let t = `${r.nome}${r.sigla ? ` (${r.sigla})` : ''} [${r.id}]: ${r.definicao}`;
      if (r.satepsi) t += ` ${D.rotulos.instrumento.satepsi}: ${linhaSatepsi(D, r.satepsi)}.`;
      if (r.publicacao) t += ` (${r.publicacao.ano}${r.publicacao.doi ? `, https://doi.org/${r.publicacao.doi}` : ''})`;
      return `${t} ${r.url}`;
    };
    const texto = registros.length
      ? registros.map(linha).join('\n') + `\n\n${fmt(M.mcpVersaoBase, { versao: base.versao, licenca: base.licenca.sigla })} ${M.mcpDicaFontes}\n${D.aviso}`
      : fmt(M.mcpSemResultado, { consulta, url: base.url });
    return ok(m.id, resultado(texto, { consulta, base: def.base, total: achados.length, versao_dos_dados: base.versao, registros }));
  }
  if (nome === 'consultar_registro') {
    if (typeof args.id !== 'string' || !args.id.trim()) return erro(m.id, -32602, M.mcpInformeId);
    return ok(m.id, umRegistro(args.id));
  }
  if (nome === 'consultar_tea' && temBase(D, 'neurobase')) return ok(m.id, umRegistro('neurobase.tea'));
  if (nome === 'consultar_tdah' && temBase(D, 'neurobase')) return ok(m.id, umRegistro('neurobase.tdah'));
  return erro(m.id, -32602, fmt(M.mcpFerramenta, { nome }));
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
