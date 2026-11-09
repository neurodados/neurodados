// Busca e leitura de registros, usadas pela API e pelo servidor MCP.

export function normalizar(texto) {
  return String(texto || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

export function registroPorChave(lista, base, chave) {
  const k = normalizar(chave);
  return lista.find((r) => r.slug === k || r.id === k || r.id === `${base}.${k}`
    || normalizar(r.sigla) === k) || null;
}

// Pontua nome, sigla e nomes alternativos acima da definição.
export function buscar(lista, consulta, { categoria } = {}) {
  const q = normalizar(consulta);
  const termos = q.split(/\s+/).filter((t) => t.length > 1);
  const candidatos = categoria ? lista.filter((r) => r.categoria === categoria) : lista;
  if (!q) return candidatos.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const pontuados = [];
  for (const r of candidatos) {
    const nomes = [r.nome, r.sigla, ...(r.nomes_alternativos || [])].filter(Boolean).map(normalizar);
    const corpo = normalizar([r.definicao, r.descricao, ...(r.afirmacoes || []).map((a) => a.texto)].join(' '));
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
  return {
    id: r.id,
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
}
