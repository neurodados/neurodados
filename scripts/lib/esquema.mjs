// Validador pequeno de JSON Schema (2020-12), sem dependências.
// Cobre o que os schemas do NeuroDados usam: $ref (local e entre arquivos da
// pasta schemas/), type, required, properties, additionalProperties: false,
// enum, const, pattern, minLength, maxLength, minItems, maxItems, uniqueItems,
// items, minimum e maximum. Palavra-chave fora dessa lista faz o validador parar,
// para ninguém achar que ela foi conferida.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CONHECIDAS = new Set([
  '$schema', '$id', '$defs', '$ref', 'title', 'description', 'type', 'required', 'properties',
  'additionalProperties', 'enum', 'const', 'pattern', 'minLength', 'maxLength', 'minItems',
  'maxItems', 'uniqueItems', 'items', 'minimum', 'maximum',
]);

export function carregarSchemas(pasta) {
  const cache = new Map();
  const ler = (nome) => {
    if (!cache.has(nome)) cache.set(nome, JSON.parse(readFileSync(join(pasta, nome), 'utf8')));
    return cache.get(nome);
  };
  return { ler };
}

function tipoDe(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (Number.isInteger(v)) return 'integer';
  return typeof v;
}

function resolver(ref, arquivoAtual, schemas) {
  const [arquivo, ponteiro = ''] = ref.split('#');
  const nome = arquivo || arquivoAtual;
  let alvo = schemas.ler(nome);
  for (const parte of ponteiro.split('/').filter(Boolean)) {
    alvo = alvo?.[decodeURIComponent(parte)];
    if (alvo === undefined) throw new Error(`$ref sem destino: ${ref} (em ${arquivoAtual})`);
  }
  return { schema: alvo, arquivo: nome };
}

export function validar(valor, schema, arquivo, schemas, caminho = '$', erros = []) {
  for (const k of Object.keys(schema)) {
    if (!CONHECIDAS.has(k)) throw new Error(`Palavra-chave não suportada pelo validador: ${k} (${arquivo})`);
  }
  if (schema.$ref) {
    const r = resolver(schema.$ref, arquivo, schemas);
    return validar(valor, r.schema, r.arquivo, schemas, caminho, erros);
  }
  const t = tipoDe(valor);
  if (schema.type) {
    const ok = schema.type === t || (schema.type === 'number' && t === 'integer');
    if (!ok) { erros.push(`${caminho}: esperado ${schema.type}, veio ${t}`); return erros; }
  }
  if ('const' in schema && valor !== schema.const) erros.push(`${caminho}: tem de ser ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(valor)) erros.push(`${caminho}: valor fora da lista (${JSON.stringify(valor)})`);
  if (t === 'string') {
    if (schema.minLength != null && [...valor].length < schema.minLength) erros.push(`${caminho}: texto curto demais (mínimo ${schema.minLength})`);
    if (schema.maxLength != null && [...valor].length > schema.maxLength) erros.push(`${caminho}: texto longo demais (máximo ${schema.maxLength})`);
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(valor)) erros.push(`${caminho}: formato inválido (${valor})`);
  }
  if (t === 'integer' || t === 'number') {
    if (schema.minimum != null && valor < schema.minimum) erros.push(`${caminho}: abaixo de ${schema.minimum}`);
    if (schema.maximum != null && valor > schema.maximum) erros.push(`${caminho}: acima de ${schema.maximum}`);
  }
  if (t === 'array') {
    if (schema.minItems != null && valor.length < schema.minItems) erros.push(`${caminho}: precisa de pelo menos ${schema.minItems} item(ns)`);
    if (schema.maxItems != null && valor.length > schema.maxItems) erros.push(`${caminho}: no máximo ${schema.maxItems} item(ns)`);
    if (schema.uniqueItems) {
      const vistos = new Set(valor.map((v) => JSON.stringify(v)));
      if (vistos.size !== valor.length) erros.push(`${caminho}: itens repetidos`);
    }
    if (schema.items) valor.forEach((v, i) => validar(v, schema.items, arquivo, schemas, `${caminho}[${i}]`, erros));
  }
  if (t === 'object') {
    for (const req of schema.required || []) {
      if (!(req in valor)) erros.push(`${caminho}: falta o campo obrigatório "${req}"`);
    }
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(valor)) {
      if (props[k]) validar(v, props[k], arquivo, schemas, `${caminho}.${k}`, erros);
      else if (schema.additionalProperties === false) erros.push(`${caminho}: campo não previsto "${k}"`);
    }
  }
  return erros;
}
