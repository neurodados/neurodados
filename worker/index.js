// Worker do NeuroDados Brasil, na rota clinicaneurobee.com.br/neurodados*.
// Entrega as páginas e os arquivos gerados em dist/site (Static Assets), a API
// (/neurodados/api/v1) e o servidor MCP (/neurodados/mcp). Fora do prefixo, a
// requisição segue para o site da clínica, sem mudança.

import { DADOS } from './gerado/dados.mjs';
import { responderApi } from './api.js';
import { responderMcp } from './mcp.js';

const P = DADOS.prefixo;

const CSP = [
  "default-src 'self'",
  "script-src 'self' https://static.cloudflareinsights.com https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com",
  "connect-src 'self' https://cloudflareinsights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jsonl': 'application/x-ndjson; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function extensao(caminho) {
  const m = caminho.match(/\.[a-z0-9]+$/i);
  return m ? m[0].toLowerCase() : '';
}

function cabecalhos(arquivo, url) {
  const ext = extensao(arquivo);
  const h = new Headers({
    'Content-Type': TIPOS[ext] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  if (ext === '.html') {
    h.set('Content-Security-Policy', CSP);
    h.set('X-Frame-Options', 'DENY');
    h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    h.set('Cache-Control', 'public, max-age=300');
  } else if ((ext === '.css' || ext === '.js') && url.searchParams.has('v')) {
    h.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    h.set('Cache-Control', 'public, max-age=3600');
    h.set('Access-Control-Allow-Origin', '*');
  }
  if (ext === '.csv' || ext === '.jsonl') {
    h.set('Content-Disposition', `inline; filename="${arquivo.split('/').pop()}"`);
  }
  return h;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const caminho = url.pathname;

    if (caminho !== P && !caminho.startsWith(P + '/')) return fetch(request);
    if (caminho === P + '/api' || caminho === P + '/api/') return Response.redirect(url.origin + P + '/api/v1', 301);
    if (caminho.startsWith(P + '/api/')) return responderApi(request, url, DADOS);
    if (caminho === P + '/mcp' || caminho === P + '/mcp/') return responderMcp(request, DADOS);

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Método não permitido.', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    if (caminho.length > P.length + 1 && caminho.endsWith('/')) {
      return Response.redirect(url.origin + caminho.replace(/\/+$/, '') + url.search, 301);
    }
    if (caminho === P + '/') return Response.redirect(url.origin + P + url.search, 301);

    const arquivo = caminho === P ? P + '.html' : (extensao(caminho) ? caminho : caminho + '.html');
    let resposta = await env.ASSETS.fetch(new Request(url.origin + arquivo, { method: request.method }));
    let status = resposta.status;
    let servido = arquivo;
    if (status === 404) {
      resposta = await env.ASSETS.fetch(new Request(url.origin + P + '/404.html', { method: request.method }));
      status = 404;
      servido = P + '/404.html';
    }
    return new Response(request.method === 'HEAD' ? null : resposta.body, { status, headers: cabecalhos(servido, url) });
  },
};
