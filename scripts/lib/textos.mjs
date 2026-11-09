// Junta todo texto público do NeuroDados (portal, metadados das bases, registros
// e a Skill) num mapa chave -> texto. É esse mapa que vai para a aprovação literal
// e que a montagem com --publicar compara com o último aprovado.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import * as T from '../../portal/textos.mjs';
import { carregarBases, textosDe, RAIZ } from './dados.mjs';

const EXPORTS_PORTAL = [
  'MARCA', 'AVISO', 'PULAR', 'MENU_ROTULO', 'ROTULOS', 'LLMS', 'MENU', 'RODAPE', 'CATEGORIAS',
  'RELACOES', 'REGISTRO', 'PAGINAS', 'FERRAMENTAS_MCP', 'MENSAGENS', 'INSTRUCOES_MCP', 'NO_SITE', 'TEMAS',
];

export const CAMINHO_SKILL = join(RAIZ, 'skill', 'neurodados', 'SKILL.md');
// Os arquivos de texto do repositório, públicos no GitHub desde 8/11/2026.
export const ARQUIVOS_DO_REPOSITORIO = ['README.md', 'CONTRIBUTING.md', 'LICENSE-DADOS.md', 'CHANGELOG.md', 'LICENSE'];
// O fim de linha não conta: numa cópia do Windows o arquivo pode vir com CRLF.
const lerTexto = (caminho) => readFileSync(caminho, 'utf8').replace(/\r\n/g, '\n');
export const ESTADOS_NO_AR = ['publicado', 'desatualizado', 'arquivado'];

// Campos técnicos (ids, datas, enums, endereços) não são texto para aprovar.
const TECNICO_REGISTRO = /^\$\.\$schema$|^\$\.(?:id|slug|base|categoria|estado|versao|criado_em|atualizado_em)$|\.url$|\.doi$|\.consultado_em$|\.data$|\.versao$|\.conferido_em$|\.situacao$|\.ano$|\.(?:de|ate)_meses$|\.fontes\[\d+\]\.(?:id|tipo)$|\.afirmacoes\[\d+\]\.fontes\[\d+\]$|\.classificacoes\[\d+\]\.(?:fonte|sistema)$|\.relacionados\[\d+\]\.(?:id|tipo)$|\.dominios\[\d+\]$|\.temas\[\d+\]$|\.instrumento\.uso$|\.satepsi\.(?:fonte|normas_validas_ate)$|\.publicacao\.idioma$/;
const TECNICO_DATASET = /\.(?:\$schema|id|versao|criado_em|atualizado_em|data|metodologia|spdx|doi|huggingface)$|\.mantenedor\.url$|\.licenca\.url$/;

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
  if (existsSync(CAMINHO_SKILL)) mapa['skill.SKILL.md'] = lerTexto(CAMINHO_SKILL);
  for (const f of ARQUIVOS_DO_REPOSITORIO) if (existsSync(join(RAIZ, f))) mapa[`repositorio.${f}`] = lerTexto(join(RAIZ, f));
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
  L.push('', `Categoria: ${(ROTULO_CATEGORIA[d.base] || {})[d.categoria] || d.categoria} · estado: ${d.estado} · revisão: ${d.revisao?.situacao}`);
  L.push('', `**${d.base === 'evidenciabase' ? 'Resumo' : 'Definição'}:** ${d.definicao}`);
  if (d.nomes_alternativos?.length) L.push('', `**Também chamado de:** ${d.nomes_alternativos.join(', ')}`);
  if (d.faixa_etaria?.descricao) L.push('', `**Faixa etária:** ${d.faixa_etaria.descricao}`);
  if (d.descricao) L.push('', `**Descrição:** ${d.descricao}`);
  if (d.publicacao) {
    const p = d.publicacao;
    L.push('', `**A publicação:** ${p.titulo_original}. ${p.autores.join('; ')}. ${p.veiculo}, ${p.ano}.${p.doi ? ` DOI ${p.doi}.` : ''} <${p.url}>`);
    if (d.temas?.length) L.push('', `**Temas:** ${d.temas.map((t) => T.TEMAS[t] || t).join(', ')}`);
    if (d.populacao) L.push('', `**Com quem:** ${d.populacao}`);
    if (d.metodo) L.push('', `**Como:** ${d.metodo}`);
  }
  if (d.instrumento) {
    const i = d.instrumento;
    const sit = T.REGISTRO.instrumento.situacoes[i.satepsi.situacao];
    L.push('', `**Ficha do instrumento:** ${i.nome_original ? `${i.nome_original}; ` : ''}o que avalia: ${i.construtos.join('; ')}; ${i.faixa_etaria?.descricao ? `faixa etária: ${i.faixa_etaria.descricao}; ` : ''}uso: ${T.REGISTRO.instrumento.usos[i.uso]}; SATEPSI: ${sit}${i.satepsi.normas_validas_ate ? `, normas até ${i.satepsi.normas_validas_ate}` : ''}, consulta em ${i.satepsi.consultado_em} (${i.satepsi.fonte}).`);
  }
  if (d.objetivos?.length) L.push('', `**Objetivos:** ${d.objetivos.join('; ')}`);
  if (d.publico) L.push('', `**Para quem:** ${d.publico}`);
  if (d.contextos?.length) L.push('', `**Onde acontece:** ${d.contextos.join('; ')}`);
  if (d.profissionais?.length) L.push('', `**Quem atende:** ${d.profissionais.join('; ')}`);
  L.push('', d.base === 'evidenciabase' ? '**Principais resultados:**' : '**Pontos principais:**');
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
  const repo = ARQUIVOS_DO_REPOSITORIO.filter((f) => atuais[`repositorio.${f}`]);
  if (repo.length) {
    L.push('## 5. O repositório no GitHub', '', 'Os arquivos de texto do repositório público (github.com/neurodados/neurodados).', '');
    for (const f of repo) L.push('### `' + f + '`', '', '````' + (f.endsWith('.md') ? 'markdown' : 'text'), atuais[`repositorio.${f}`].trimEnd(), '````', '');
  }
  return L.join('\n');
}
