// Leitura das bases e dos registros do repositório, e as regras de texto da casa.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PASTA_SCHEMAS = join(RAIZ, 'schemas');
export const PASTA_BASES = join(RAIZ, 'bases');

// Endereço público. Mudou o domínio, muda aqui e o resto segue.
export const SITE = {
  origem: 'https://clinicaneurobee.com.br',
  prefixo: '/neurodados',
  mantenedor: 'Clínica NeuroBee',
  mantenedorUrl: 'https://clinicaneurobee.com.br',
  mantenedorId: 'https://clinicaneurobee.com.br/#clinica',
  // Contato do NeuroDados: correções, contribuições e pedidos de retirada.
  email: 'empresa@otimiza.pro',
  privacidade: 'https://clinicaneurobee.com.br/privacidade',
  // Os mesmos do site da clínica (decisão D7 de 8/11/2026). Só entram na montagem --publicar.
  ga4: 'G-77EPG3EWRK',
  clarity: 'zamdf6a4tu',
};
export const URL_BASE = SITE.origem + SITE.prefixo;

export function lerJson(caminho) {
  return JSON.parse(readFileSync(caminho, 'utf8'));
}

// Todas as bases: a pasta bases/<id>/ com dataset.json e registros/*.json.
export function carregarBases() {
  if (!existsSync(PASTA_BASES)) return [];
  return readdirSync(PASTA_BASES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(PASTA_BASES, d.name, 'dataset.json')))
    .map((d) => {
      const pasta = join(PASTA_BASES, d.name);
      const dataset = lerJson(join(pasta, 'dataset.json'));
      const pastaRegistros = join(pasta, 'registros');
      const arquivos = existsSync(pastaRegistros)
        ? readdirSync(pastaRegistros).filter((f) => f.endsWith('.json')).sort()
        : [];
      const registros = arquivos.map((f) => ({ arquivo: join(pastaRegistros, f), nomeArquivo: f, dados: lerJson(join(pastaRegistros, f)) }));
      return { id: d.name, pasta, dataset, registros };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

// Regras de texto que valem para tudo o que é público.
const TRAVESSOES = /[‒–—―]/u;
const ESPECIALISTA = /\bespeciali(?:sta|stas|zad[oa]s?)\b/iu;
const PRECO = /R\$/u;
const MARCA_NOS_REGISTROS = /\b(?:neuro\s?bee|jessica)\b/iu;
const PROMESSA = /\b(?:cura|curar|garantimos|garantia de resultado)\b/iu;
const SUPERLATIVO = /\b(?:o|a) (?:melhor|maior) (?:do|da) (?:brasil|país|mundo)\b|\blíder\b/iu;

export function errosDeTexto(texto, { registro = false } = {}) {
  const erros = [];
  if (TRAVESSOES.test(texto)) erros.push('travessão');
  if (ESPECIALISTA.test(texto)) erros.push('"especialista" ou "especializado"');
  if (PRECO.test(texto)) erros.push('preço (R$)');
  if (registro && MARCA_NOS_REGISTROS.test(texto)) erros.push('nome da clínica ou de profissional dentro de registro');
  if (PROMESSA.test(texto)) erros.push('promessa de cura ou de resultado');
  if (SUPERLATIVO.test(texto)) erros.push('superlativo');
  return erros;
}

// Percorre todas as strings de um objeto, com o caminho de cada uma.
export function* textosDe(valor, caminho = '$') {
  if (typeof valor === 'string') yield [caminho, valor];
  else if (Array.isArray(valor)) for (let i = 0; i < valor.length; i++) yield* textosDe(valor[i], `${caminho}[${i}]`);
  else if (valor && typeof valor === 'object') for (const [k, v] of Object.entries(valor)) yield* textosDe(v, `${caminho}.${k}`);
}

export function hoje() {
  // Data de Brasília, para não virar o dia às 21h.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}

export function urlRegistro(base, slug) {
  return `${URL_BASE}/bases/${base}/${slug}`;
}
export function urlApiRegistro(base, slug) {
  return `${URL_BASE}/api/v1/${base}/${slug}`;
}
