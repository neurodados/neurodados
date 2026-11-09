// Confere as bases e os registros: o schema, a ligação entre afirmações e fontes,
// as relações entre registros, as datas e as regras de texto da casa.
// Uso: node scripts/validar.mjs   (sai com código 1 se houver erro)

import { basename } from 'node:path';
import { carregarSchemas, validar } from './lib/esquema.mjs';
import { carregarBases, errosDeTexto, textosDe, hoje, PASTA_SCHEMAS } from './lib/dados.mjs';
import { coletarTextos } from './lib/textos.mjs';

const schemas = carregarSchemas(PASTA_SCHEMAS);
const dia = hoje();
let totalErros = 0;
let totalAvisos = 0;
const erro = (onde, msg) => { totalErros++; console.log(`ERRO  ${onde}: ${msg}`); };
const aviso = (onde, msg) => { totalAvisos++; console.log(`aviso ${onde}: ${msg}`); };

const bases = carregarBases();
if (!bases.length) erro('bases', 'nenhuma base encontrada em bases/');

const idsPorBase = new Map();
for (const b of bases) idsPorBase.set(b.id, new Set(b.registros.map((r) => r.dados.id)));

for (const b of bases) {
  const onde = `bases/${b.id}/dataset.json`;
  for (const e of validar(b.dataset, schemas.ler('dataset.schema.json'), 'dataset.schema.json', schemas)) erro(onde, e);
  if (b.dataset.id !== b.id) erro(onde, `o id (${b.dataset.id}) tem de ser o nome da pasta (${b.id})`);
  for (const [c, t] of textosDe(b.dataset)) for (const e of errosDeTexto(t)) erro(onde, `${e} em ${c}`);

  const schemaArquivo = `${b.id}.schema.json`;
  let schemaBase;
  try { schemaBase = schemas.ler(schemaArquivo); } catch { erro(onde, `falta o schema ${schemaArquivo}`); continue; }

  const vistos = new Set();
  for (const r of b.registros) {
    const d = r.dados;
    const local = `bases/${b.id}/registros/${r.nomeArquivo}`;
    for (const e of validar(d, schemaBase, schemaArquivo, schemas)) erro(local, e);
    if (typeof d.id !== 'string') continue;

    if (vistos.has(d.id)) erro(local, `id repetido: ${d.id}`);
    vistos.add(d.id);
    if (d.id !== `${b.id}.${d.slug}`) erro(local, `o id tem de ser "${b.id}." mais o slug`);
    if (basename(r.nomeArquivo, '.json') !== d.slug) erro(local, 'o nome do arquivo tem de ser o slug');

    const fontes = new Map();
    for (const f of d.fontes || []) {
      if (fontes.has(f.id)) erro(local, `fonte repetida: ${f.id}`);
      fontes.set(f.id, f);
      if (f.consultado_em > dia) erro(local, `fonte ${f.id} consultada no futuro (${f.consultado_em})`);
      // O DATASUS só abre a CID-10 em http; nos outros endereços, http vira aviso.
      if (/^http:\/\//.test(f.url) && !/^http:\/\/www2\.datasus\.gov\.br\//.test(f.url)) aviso(local, `fonte ${f.id} sem https (${f.url})`);
    }
    const usadas = new Set();
    (d.afirmacoes || []).forEach((a, i) => {
      for (const id of a.fontes || []) {
        usadas.add(id);
        if (!fontes.has(id)) erro(local, `afirmação ${i + 1} cita a fonte ${id}, que não existe`);
      }
    });
    for (const c of d.classificacoes || []) {
      usadas.add(c.fonte);
      if (!fontes.has(c.fonte)) erro(local, `classificação ${c.sistema} ${c.codigo} cita a fonte ${c.fonte}, que não existe`);
    }
    for (const id of fontes.keys()) if (!usadas.has(id)) aviso(local, `a fonte ${id} não sustenta nenhuma afirmação`);

    for (const rel of d.relacionados || []) {
      const [baseAlvo] = rel.id.split('.');
      if (rel.id === d.id) erro(local, 'relação com o próprio registro');
      else if (idsPorBase.has(baseAlvo)) {
        if (!idsPorBase.get(baseAlvo).has(rel.id)) erro(local, `relação com registro que não existe: ${rel.id}`);
      } else aviso(local, `relação com base que ainda não existe: ${rel.id}`);
    }

    const rev = d.revisao || {};
    if (rev.situacao === 'revisado' && !(rev.revisores || []).length) erro(local, 'revisado sem revisor nomeado');
    if (rev.situacao !== 'revisado' && (rev.revisores || []).length) aviso(local, 'tem revisor, mas a situação não é "revisado"');
    if (d.criado_em && d.atualizado_em && d.atualizado_em < d.criado_em) erro(local, 'atualizado antes de criado');
    const ultimo = (d.historico || []).at(-1);
    if (ultimo && ultimo.versao !== d.versao) erro(local, `a última linha do histórico (${ultimo.versao}) não é a versão atual (${d.versao})`);

    for (const [c, t] of textosDe(d)) {
      if (c.endsWith('.url') || c.endsWith('.doi') || c === '$.$schema') continue;
      // O que é literal da fonte (trecho de lei, título de documento, título
      // oficial da classificação) fica como está na fonte: só a regra da marca vale.
      const literal = /\.fontes\[\d+\]\.(?:trecho|titulo|autor|referencia)$|\.classificacoes\[\d+\]\.titulo$/.test(c);
      const erros = errosDeTexto(t, { registro: true }).filter((e) => !literal || e.startsWith('nome da clínica'));
      for (const e of erros) erro(local, `${e} em ${c}`);
    }
  }
}

// Os textos do portal e a Skill seguem as mesmas regras.
for (const [k, t] of Object.entries(coletarTextos())) {
  if (!k.startsWith('portal.') && k !== 'skill.SKILL.md') continue;
  for (const e of errosDeTexto(t)) erro(k, e);
}

const contagem = {};
for (const b of bases) for (const r of b.registros) {
  const k = `${b.id} · ${r.dados.estado} · ${r.dados.revisao?.situacao}`;
  contagem[k] = (contagem[k] || 0) + 1;
}
console.log('\nRegistros:');
for (const [k, n] of Object.entries(contagem)) console.log(`  ${k}: ${n}`);
console.log(`\n${totalErros} erro(s), ${totalAvisos} aviso(s).`);
process.exit(totalErros ? 1 : 0);
