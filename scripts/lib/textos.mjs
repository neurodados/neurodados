// Junta todo texto público do NeuroDados (portal, metadados das bases, registros
// e a Skill) num mapa chave -> texto. É esse mapa que vai para a aprovação literal
// e que a montagem com --publicar compara com o último aprovado.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import * as T from '../../portal/textos.mjs';
import { carregarBases, textosDe, RAIZ } from './dados.mjs';

const EXPORTS_PORTAL = [
  'MARCA', 'AVISO', 'PULAR', 'MENU_ROTULO', 'ROTULOS', 'LLMS', 'MENU', 'RODAPE', 'CATEGORIAS',
  'RELACOES', 'REGISTRO', 'PAGINAS', 'FERRAMENTAS_MCP', 'MENSAGENS', 'INSTRUCOES_MCP', 'NO_SITE',
];

export const CAMINHO_SKILL = join(RAIZ, 'skill', 'neurodados', 'SKILL.md');
export const ESTADOS_NO_AR = ['publicado', 'desatualizado', 'arquivado'];

// Campos técnicos (ids, datas, enums, endereços) não são texto para aprovar.
const TECNICO_REGISTRO = /^\$\.\$schema$|^\$\.(?:id|slug|base|categoria|estado|versao|criado_em|atualizado_em)$|\.url$|\.doi$|\.consultado_em$|\.data$|\.versao$|\.conferido_em$|\.situacao$|\.ano$|\.(?:de|ate)_meses$|\.fontes\[\d+\]\.(?:id|tipo)$|\.afirmacoes\[\d+\]\.fontes\[\d+\]$|\.classificacoes\[\d+\]\.(?:fonte|sistema)$|\.relacionados\[\d+\]\.(?:id|tipo)$|\.dominios\[\d+\]$/;
const TECNICO_DATASET = /\.(?:\$schema|id|versao|criado_em|atualizado_em|data|metodologia|spdx)$|\.mantenedor\.url$|\.licenca\.url$/;

export function coletarTextos({ somenteNoAr = false, exceto = [] } = {}) {
  const mapa = {};
  for (const nome of EXPORTS_PORTAL) {
    // Fora: caminhos (/bases) e marcadores sozinhos ({api}), que não são texto.
    for (const [c, t] of textosDe(T[nome], `portal.${nome}`)) if (t && !t.startsWith('/') && !/^\{\w+\}$/.test(t)) mapa[c] = t;
  }
  for (const b of carregarBases()) {
    for (const [c, t] of textosDe(b.dataset, `bases.${b.id}`)) if (!TECNICO_DATASET.test(c)) mapa[c] = t;
    for (const r of b.registros) {
      const d = r.dados;
      if (exceto.includes(d.id)) continue;
      if (somenteNoAr && !ESTADOS_NO_AR.includes(d.estado)) continue;
      for (const [c, t] of textosDe(d)) if (!TECNICO_REGISTRO.test(c)) mapa[`registros.${d.id}${c.slice(1)}`] = t;
    }
  }
  if (existsSync(CAMINHO_SKILL)) mapa['skill.SKILL.md'] = readFileSync(CAMINHO_SKILL, 'utf8');
  return mapa;
}

export function diferencas(atuais, anteriores = {}) {
  const novos = [];
  const alterados = [];
  for (const [k, t] of Object.entries(atuais)) {
    if (!(k in anteriores)) novos.push(k);
    else if (anteriores[k] !== t) alterados.push(k);
  }
  const removidos = Object.keys(anteriores).filter((k) => !(k in atuais));
  return { novos, alterados, removidos };
}

const ROTULO_CATEGORIA = T.CATEGORIAS;

function blocoRegistro(d) {
  const L = [];
  L.push(`### ${d.sigla ? `${d.nome} (${d.sigla})` : d.nome} · \`${d.id}\``);
  L.push('', `Categoria: ${ROTULO_CATEGORIA[d.categoria] || d.categoria} · estado: ${d.estado} · revisão: ${d.revisao?.situacao}`);
  L.push('', `**Definição:** ${d.definicao}`);
  if (d.nomes_alternativos?.length) L.push('', `**Também chamado de:** ${d.nomes_alternativos.join(', ')}`);
  if (d.descricao) L.push('', `**Descrição:** ${d.descricao}`);
  L.push('', '**Pontos principais:**');
  d.afirmacoes.forEach((a, i) => L.push(`${i + 1}. ${a.texto} (${a.fontes.join(', ')})`));
  if (d.classificacoes?.length) {
    L.push('', '**Classificação:**');
    for (const c of d.classificacoes) L.push(`- ${c.sistema} ${c.codigo}: ${c.titulo} (${c.fonte})`);
  }
  if (d.relacionados?.length) L.push('', `**Relacionados:** ${d.relacionados.map((r) => `${T.RELACOES[r.tipo]} ${r.id}`).join('; ')}`);
  L.push('', '**Limitações:**');
  for (const l of d.limitacoes) L.push(`- ${l}`);
  L.push('', '**Fontes:**');
  for (const f of d.fontes) {
    L.push(`- ${f.id}: ${f.titulo}. ${f.autor}, ${f.ano}.${f.referencia ? ` ${f.referencia}.` : ''} <${f.url}>${f.doi ? ` (DOI ${f.doi})` : ''}, consultado em ${f.consultado_em}.`);
    if (f.trecho) L.push(`  > "${f.trecho}"`);
  }
  return L.join('\n');
}

export function documentoAprovacao({ atuais, anteriores, aprovadoEm }) {
  const { novos, alterados, removidos } = diferencas(atuais, anteriores || {});
  const bases = carregarBases();
  const L = [];
  L.push('# NeuroDados Brasil: textos para aprovar', '');
  L.push(`Gerado em ${new Date().toISOString().slice(0, 10)} pelo \`scripts/textos.mjs\`. Todo texto público do NeuroDados está aqui: o portal, os metadados da base, os registros e a Skill. Nada vai ao ar sem a aprovação literal.`, '');
  L.push('## O que mudou desde a última aprovação', '');
  if (!anteriores) L.push('Primeira aprovação: tudo é novo.');
  else {
    L.push(`Última aprovação: ${aprovadoEm}. Novos: ${novos.length}. Alterados: ${alterados.length}. Removidos: ${removidos.length}.`);
    for (const k of alterados) L.push('', `- \`${k}\``, `  - antes: ${anteriores[k]}`, `  - agora: ${atuais[k]}`);
    for (const k of novos) L.push(`- novo: \`${k}\`: ${atuais[k].length > 300 ? atuais[k].slice(0, 300) + '...' : atuais[k]}`);
    for (const k of removidos) L.push(`- removido: \`${k}\``);
  }
  L.push('', '## 1. O portal', '');
  L.push('Textos fixos das páginas, das mensagens da API e do servidor MCP. A chave diz onde cada um aparece.', '');
  for (const [k, t] of Object.entries(atuais)) if (k.startsWith('portal.')) L.push(`- \`${k.slice(7)}\`: ${t}`);
  for (const b of bases) {
    L.push('', `## 2. A base ${b.dataset.nome}`, '');
    for (const [k, t] of Object.entries(atuais)) if (k.startsWith(`bases.${b.id}.`)) L.push(`- \`${k.slice(b.id.length + 7)}\`: ${t}`);
    L.push('', `## 3. Os registros da ${b.dataset.nome}`, '');
    for (const r of b.registros) L.push(blocoRegistro(r.dados), '');
  }
  if (atuais['skill.SKILL.md']) L.push('## 4. A Skill (SKILL.md)', '', '````markdown', atuais['skill.SKILL.md'].trimEnd(), '````', '');
  return L.join('\n');
}
