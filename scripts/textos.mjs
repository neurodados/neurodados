// Aprovação literal dos textos do NeuroDados.
//   node scripts/textos.mjs
//       grava ../TEXTOS-PARA-APROVAR.md (na pasta de coordenação, fora do repositório)
//   node scripts/textos.mjs --aprovado [--exceto neurobase.x,neurobase.y]
//       só depois da aprovação literal: grava ../TEXTOS-APROVADOS.json e passa
//       os registros aprovados de rascunho para publicado.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { RAIZ, carregarBases, hoje } from './lib/dados.mjs';
import { coletarTextos, documentoAprovacao, diferencas } from './lib/textos.mjs';

const COORDENACAO = join(RAIZ, '..');
const PARA_APROVAR = join(COORDENACAO, 'TEXTOS-PARA-APROVAR.md');
const APROVADOS = join(COORDENACAO, 'TEXTOS-APROVADOS.json');

const args = process.argv.slice(2);
const i = args.indexOf('--exceto');
const exceto = i >= 0 ? (args[i + 1] || '').split(',').map((s) => s.trim()).filter(Boolean) : [];
const anterior = existsSync(APROVADOS) ? JSON.parse(readFileSync(APROVADOS, 'utf8')) : null;

if (args.includes('--aprovado')) {
  const textos = coletarTextos({ exceto });
  writeFileSync(APROVADOS, JSON.stringify({ aprovado_em: hoje(), exceto, textos }, null, 2) + '\n');
  let publicados = 0;
  for (const b of carregarBases()) {
    for (const r of b.registros) {
      if (r.dados.estado !== 'rascunho' || exceto.includes(r.dados.id)) continue;
      r.dados.estado = 'publicado';
      writeFileSync(r.arquivo, JSON.stringify(r.dados, null, 2) + '\n');
      publicados++;
    }
  }
  console.log(`Aprovado: ${Object.keys(textos).length} textos gravados em TEXTOS-APROVADOS.json; ${publicados} registro(s) passaram a publicado.`);
} else {
  const atuais = coletarTextos();
  writeFileSync(PARA_APROVAR, documentoAprovacao({ atuais, anteriores: anterior?.textos, aprovadoEm: anterior?.aprovado_em }));
  const d = diferencas(atuais, anterior?.textos || {});
  console.log(`TEXTOS-PARA-APROVAR.md gravado: ${Object.keys(atuais).length} textos (novos ${d.novos.length}, alterados ${d.alterados.length}, removidos ${d.removidos.length}).`);
}
