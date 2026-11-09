// Busca e leitura de registros, usadas pela API e pelo servidor MCP.

export function normalizar(texto) {
  return String(texto || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

export function registroPorChave(lista, base, chave) {
  const k = normalizar(chave);
  return lista.find((r) => r.slug === k || r.id === k || r.id === `${base}.${k}`
    || (r.sigla && normalizar(r.sigla) === k)) || null;
}

// Os nomes pelos quais um registro é procurado: nome, sigla, nomes alternativos
// e, nas publicações, o título original e os sobrenomes dos autores.
function nomesDe(r) {
  const nomes = [r.nome, r.sigla, ...(r.nomes_alternativos || [])];
  if (r.instrumento?.nome_original) nomes.push(r.instrumento.nome_original);
  // Normas: o número com e sem ponto ("12.764" e "12764").
  if (r.norma?.numero) nomes.push(r.norma.numero, r.norma.numero.replace(/\./g, ''));
  if (r.publicacao) {
    nomes.push(r.publicacao.titulo_original);
    for (const a of r.publicacao.autores || []) nomes.push(a.split(/[ ,]+/)[0]);
  }
  return nomes.filter(Boolean).map(normalizar);
}

// Pontua os nomes acima do resto do texto.
export function buscar(lista, consulta, { categoria } = {}) {
  const q = normalizar(consulta);
  const termos = q.split(/\s+/).filter((t) => t.length > 1);
  const candidatos = categoria ? lista.filter((r) => r.categoria === categoria) : lista;
  if (!q) return candidatos.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const pontuados = [];
  for (const r of candidatos) {
    const nomes = nomesDe(r);
    const corpo = normalizar([
      r.definicao, r.descricao, r.publico, r.populacao, r.metodo, r.norma?.ementa,
      ...(r.afirmacoes || []).map((a) => a.texto), ...(r.objetivos || []), ...(r.instrumento?.construtos || []), ...(r.temas || []),
    ].join(' '));
    let p = 0;
    if (nomes.some((n) => n === q)) p += 100;
    else if (nomes.some((n) => n.startsWith(q))) p += 60;
    else if (nomes.some((n) => n.includes(q))) p += 40;
    for (const t of termos) {
      if (nomes.some((n) => n.includes(t))) p += 10;
      else if (corpo.includes(t)) p += 3;
    }
    if (p > 0) pontuados.push([p, r]);
  }
  return pontuados.sort((a, b) => b[0] - a[0] || a[1].nome.localeCompare(b[1].nome, 'pt-BR')).map(([, r]) => r);
}

export function resumo(r) {
  const s = {
    id: r.id,
    base: r.base,
    slug: r.slug,
    nome: r.nome,
    sigla: r.sigla || null,
    categoria: r.categoria,
    definicao: r.definicao,
    situacao_revisao: r.revisao.situacao,
    estado: r.estado,
    atualizado_em: r.atualizado_em,
    url: r.url,
    api_url: r.api_url,
  };
  if (r.instrumento) s.satepsi = r.instrumento.satepsi;
  if (r.publicacao) s.publicacao = { titulo_original: r.publicacao.titulo_original, ano: r.publicacao.ano, doi: r.publicacao.doi || null };
  if (r.norma) {
    const oficial = (r.fontes || []).find((f) => f.id === r.norma.fonte);
    s.norma = { tipo: r.norma.tipo, numero: r.norma.numero, data: r.norma.data, vigencia: r.norma.vigencia.situacao, vigencia_conferida_em: r.norma.vigencia.conferido_em, texto_oficial: oficial ? oficial.url : null };
    s.condicoes = r.condicoes || [];
    s.areas = r.areas || [];
  }
  return s;
}
