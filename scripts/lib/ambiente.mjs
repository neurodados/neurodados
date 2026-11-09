// Ambiente local do Worker, para os testes e a prévia: o ASSETS lê de dist/site,
// e o que sai do prefixo /neurodados responde como "site da clínica".

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { RAIZ } from './dados.mjs';

export const DIST_SITE = join(RAIZ, 'dist', 'site');

export function ambienteLocal() {
  return {
    ASSETS: {
      async fetch(entrada) {
        const u = new URL(typeof entrada === 'string' ? entrada : entrada.url);
        const arquivo = resolve(DIST_SITE, '.' + decodeURIComponent(u.pathname));
        if (!arquivo.startsWith(DIST_SITE) || !existsSync(arquivo) || !statSync(arquivo).isFile()) {
          return new Response('não encontrado', { status: 404 });
        }
        return new Response(readFileSync(arquivo), { status: 200 });
      },
    },
  };
}

export function origemFalsa() {
  globalThis.fetch = async (req) => new Response(`SITE DA CLÍNICA: ${new URL(req.url).pathname}`, { status: 200, headers: { 'X-Origem': 'site' } });
}

export async function carregarWorker() {
  const caminho = join(RAIZ, 'worker', 'index.js');
  const mod = await import('file:///' + caminho.replace(/\\/g, '/') + `?t=${Date.now()}`);
  return mod.default;
}
