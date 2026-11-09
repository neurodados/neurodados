// API pública do NeuroDados: /neurodados/api/v1. Só leitura, sem chave, JSON.

import { buscar, registroPorChave, resumo } from './busca.js';

const CABECALHOS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Cache-Control': 'public, max-age=300',
  'X-Content-Type-Options': 'nosniff',
};

function json(dados, status = 200, extra = {}) {
  return new Response(JSON.stringify(dados, null, 2), { status, headers: { ...CABECALHOS, ...extra } });
}

function envelope(D, base, dados) {
  const e = { fonte: D.mensagens.fonte };
  if (base) {
    e.base = base.id;
    e.versao_dos_dados = base.versao;
    e.licenca = base.licenca;
    e.citar_como = base.citacao;
  }
  e.aviso = D.aviso;
  e.dados = dados;
  return e;
}

function naoEncontrado(D, mensagem = D.mensagens.naoEncontrado) {
  return json({ erro: mensagem, documentacao: D.urlBase + '/documentacao' }, 404);
}

export function responderApi(request, url, D) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CABECALHOS });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return json({ erro: D.mensagens.apiMetodo }, 405, { Allow: 'GET, HEAD, OPTIONS' });
  }
  const partes = url.pathname.slice(D.prefixo.length).split('/').filter(Boolean); // ['api', 'v1', ...]
  if (partes[1] !== 'v1') return naoEncontrado(D, D.mensagens.apiVersao);
  const [, , recurso, chave, ...resto] = partes;

  if (!recurso) {
    return json(envelope(D, null, {
      nome: D.nome,
      versao_da_api: '1',
      documentacao: D.urlBase + '/documentacao',
      openapi: D.urlBase + '/api/v1/openapi.json',
      mcp: D.urlBase + '/mcp',
      bases: D.bases.map((b) => ({ id: b.id, nome: b.nome, versao: b.versao, registros: b.n, api_url: b.api })),
    }));
  }
  if (recurso === 'openapi.json' && !chave) return json(D.openapi);
  if (recurso === 'bases' && !chave) {
    return json(envelope(D, null, D.bases.map((b) => ({
      id: b.id, nome: b.nome, titulo: b.titulo, descricao: b.descricao, versao: b.versao, atualizado_em: b.atualizado_em,
      registros: b.n, licenca: b.licenca, url: b.url, api_url: b.api, downloads: b.downloads,
      ...(b.doi ? { doi: b.doi } : {}), ...(b.huggingface ? { huggingface: b.huggingface } : {}),
    }))));
  }

  const base = D.bases.find((b) => b.id === recurso);
  if (!base || resto.length) return naoEncontrado(D);
  const lista = D.registros[base.id] || [];

  if (!chave) {
    const p = url.searchParams;
    const categoria = p.get('categoria') || '';
    const categorias = (D.categoriasPorBase || {})[base.id] || [];
    if (categoria && !categorias.includes(categoria)) {
      return json({ erro: D.mensagens.categoriaDesconhecida, categorias }, 400);
    }
    const q = (p.get('q') || '').slice(0, 100);
    const porPagina = Math.min(100, Math.max(1, parseInt(p.get('por_pagina') || '20', 10) || 20));
    const pagina = Math.max(1, parseInt(p.get('pagina') || '1', 10) || 1);
    const achados = buscar(lista, q, { categoria: categoria || undefined });
    const inicio = (pagina - 1) * porPagina;
    return json(envelope(D, base, {
      total: achados.length,
      pagina,
      por_pagina: porPagina,
      paginas: Math.max(1, Math.ceil(achados.length / porPagina)),
      registros: achados.slice(inicio, inicio + porPagina).map(resumo),
    }));
  }

  const r = registroPorChave(lista, base.id, decodeURIComponent(chave));
  if (!r) return naoEncontrado(D, D.mensagens.registroNaoEncontrado);
  return json(envelope(D, base, r));
}
