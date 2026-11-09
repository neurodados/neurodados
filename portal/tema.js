// Tema do NeuroDados: claro, escuro ou o do aparelho (o padrão), como no site da T&D.
// Roda no <head>, antes da pintura, para a página não abrir no tema errado; os
// botões do cabeçalho se ligam depois que a página carrega. Sem JavaScript, o
// seletor fica escondido e vale o tema do aparelho.
(() => {
  const raiz = document.documentElement;
  const CHAVE = 'neurodados-tema';
  const lido = () => {
    try {
      const v = localStorage.getItem(CHAVE);
      return v === 'claro' || v === 'escuro' ? v : 'sistema';
    } catch {
      return 'sistema';
    }
  };
  const inicial = lido();
  if (inicial !== 'sistema') raiz.dataset.tema = inicial;
  raiz.classList.add('js');

  document.addEventListener('DOMContentLoaded', () => {
    const opcoes = [...document.querySelectorAll('[data-tema-opcao]')];
    const pintar = (escolha) => opcoes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.temaOpcao === escolha)));
    pintar(lido());
    opcoes.forEach((b) => b.addEventListener('click', () => {
      const escolha = b.dataset.temaOpcao;
      if (escolha === 'sistema') delete raiz.dataset.tema;
      else raiz.dataset.tema = escolha;
      try {
        if (escolha === 'sistema') localStorage.removeItem(CHAVE);
        else localStorage.setItem(CHAVE, escolha);
      } catch {
        // Navegação privada sem armazenamento: vale só nesta página.
      }
      pintar(escolha);
    }));
  });
})();
