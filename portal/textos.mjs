// Todos os textos fixos do portal do NeuroDados Brasil. É daqui que sai a lista
// para a aprovação literal (scripts/textos.mjs): texto mudou aqui, volta para
// a aprovação. {email}, {n}, {versao} e afins são preenchidos na montagem.

export const MARCA = {
  nome: 'NeuroDados Brasil',
  nomeCurto: 'NeuroDados',
  assinatura: 'Uma iniciativa de dados abertos desenvolvida e mantida pela Clínica NeuroBee em parceria com a Otimiza.pro.',
  lema: 'Dados abertos sobre neurodesenvolvimento, com a fonte de cada informação.',
};

export const AVISO = 'Conteúdo informativo. Não serve para diagnóstico e não substitui a avaliação de um profissional habilitado.';

export const PULAR = 'Pular para o conteúdo';
export const MENU_ROTULO = 'Menu do NeuroDados';

// O seletor de tema do cabeçalho, o mesmo do site da T&D: o nome de cada botão é
// lido pelo leitor de tela e aparece ao passar o mouse.
export const TEMA = {
  grupo: 'Tema do site',
  claro: 'Tema claro',
  escuro: 'Tema escuro',
  sistema: 'Seguir o sistema',
};

// Rótulos curtos das tabelas e dos links.
export const ROTULOS = {
  sistema: 'Sistema',
  codigo: 'Código',
  titulo: 'Título',
  fonte: 'Fonte',
  fonteN: 'Fonte {n}',
  schema: 'schema',
  naoEncontrada: [['Bases', '/bases'], ['Documentação', '/documentacao']],
};

// O resumo para modelos de linguagem (/neurodados/llms.txt).
export const LLMS = {
  resumo: 'Dados abertos sobre neurodesenvolvimento e desenvolvimento infantil, com a fonte de cada informação. Uma iniciativa de dados abertos desenvolvida e mantida pela Clínica NeuroBee, no Rio de Janeiro, em parceria com a Otimiza.pro. Dados sob a licença CC BY 4.0.',
  bases: 'Bases',
  linhaBase: '{titulo}. {n} registros, versão {versao}. JSON: {json} · JSONL: {jsonl} · CSV: {csv}',
  registros: 'Registros da {nome}',
  consultar: 'Como consultar',
  itensConsultar: [
    ['API (JSON, sem chave)', '{api}'],
    ['OpenAPI', '{openapi}'],
    ['Servidor MCP', '{mcp}'],
    ['Skill', '{skill}'],
    ['Código e histórico das versões (GitHub)', '{github}'],
    ['As bases no Hugging Face', '{huggingface}'],
  ],
  regras: 'Regras',
  itensRegras: [
    ['Governança', '{governanca}'],
    ['Metodologia', '{metodologia}'],
    ['Licenças', '{licencas}'],
    ['Regulação de neurodados', '{regulacao}'],
  ],
  citar: 'Como citar',
  citacao: 'NeuroDados Brasil, Clínica NeuroBee. Nome da base, versão. Endereço do registro ou da base. Licença CC BY 4.0.',
};

export const MENU = [
  ['Início', ''],
  ['Bases', '/bases'],
  ['Documentação', '/documentacao'],
  ['Governança', '/governanca'],
  ['Metodologia', '/metodologia'],
  ['Sobre', '/sobre'],
];

export const RODAPE = {
  mantido: 'Mantido pela Clínica NeuroBee',
  links: [
    ['Licenças', '/licencas'],
    ['Contribuições', '/contribuicoes'],
    ['Atualizações', '/atualizacoes'],
    ['Regulação de neurodados', '/regulacao-de-neurodados'],
  ],
  privacidade: 'Política de privacidade',
  licenca: 'Dados sob a licença CC BY 4.0. Código sob a licença MIT.',
  credito: 'Desenvolvido pela Otimiza.pro',
  // Título da coluna do rodapé com as páginas do projeto (as outras colunas usam "Bases" e "Documentação", do menu).
  projeto: 'O projeto',
};

// As categorias de cada base, na ordem em que aparecem na página da base.
export const CATEGORIAS = {
  neurobase: {
    conceito: 'Conceitos',
    condicao_do_neurodesenvolvimento: 'Condições do neurodesenvolvimento',
    dominio_do_desenvolvimento: 'Domínios do desenvolvimento',
    marco_do_desenvolvimento: 'Marcos do desenvolvimento',
    termo_clinico: 'Termos clínicos',
  },
  avaliabase: {
    conceito: 'Conceitos',
    etapa: 'Etapas da avaliação',
    documento: 'Documentos',
    orientacao: 'Orientações',
    instrumento: 'Instrumentos',
  },
  intervenbase: {
    modelo_de_cuidado: 'Modelos de cuidado',
    abordagem_terapeutica: 'Abordagens terapêuticas',
    area_profissional: 'Áreas de atendimento',
    apoio_a_familia: 'Apoio à família',
    intervencao_educacional: 'Na escola',
    direito_e_cobertura: 'Direitos e cobertura',
  },
  evidenciabase: {
    diretriz_clinica: 'Diretrizes clínicas',
    consenso: 'Consensos',
    revisao_sistematica: 'Revisões sistemáticas',
    meta_analise: 'Meta-análises',
    revisao_narrativa: 'Revisões narrativas',
    estudo_populacional: 'Estudos populacionais',
    estudo_primario: 'Estudos primários',
    documento_oficial: 'Documentos oficiais',
  },
  neurodireitos: {
    tratado_internacional: 'Tratados internacionais',
    lei: 'Leis',
    decreto: 'Decretos',
    norma_infralegal: 'Portarias e resoluções',
  },
};

// NeuroDireitos: a quem a norma se refere e em que áreas ela garante direitos.
export const CONDICOES = {
  tea: 'TEA',
  tdah: 'TDAH',
  dislexia: 'Dislexia',
  transtornos_de_aprendizagem: 'Transtornos de aprendizagem',
  sindrome_de_tourette: 'Síndrome de Tourette',
  deficiencia_intelectual: 'Deficiência intelectual',
  deficiencia: 'Pessoa com deficiência',
  altas_habilidades: 'Altas habilidades ou superdotação',
  saude_mental: 'Saúde mental',
  doencas_raras: 'Doenças raras',
  doencas_cronicas: 'Doenças crônicas e graves',
  desenvolvimento_infantil: 'Desenvolvimento infantil',
};

export const AREAS = {
  direitos_gerais: 'Direitos gerais',
  educacao: 'Educação',
  saude: 'Saúde',
  planos_de_saude: 'Planos de saúde',
  assistencia_social: 'Assistência social',
  trabalho: 'Trabalho',
  previdencia: 'Previdência',
  tributos: 'Tributos',
  transporte: 'Transporte',
  acessibilidade: 'Acessibilidade',
  atendimento_prioritario: 'Atendimento prioritário',
  identificacao: 'Identificação',
  cultura_e_lazer: 'Cultura e lazer',
  justica: 'Justiça',
};

// Temas da EvidenciaBase.
export const TEMAS = {
  tea: 'TEA',
  tdah: 'TDAH',
  aprendizagem: 'Aprendizagem',
  deficiencia_intelectual: 'Deficiência intelectual',
  linguagem: 'Linguagem',
  desenvolvimento_infantil: 'Desenvolvimento infantil',
  funcoes_executivas: 'Funções executivas',
  avaliacao: 'Avaliação',
  rastreamento: 'Rastreamento',
  intervencoes: 'Intervenções',
  prevalencia: 'Prevalência',
  saude_publica: 'Saúde pública',
};

export const RELACOES = {
  relacionado: 'Relacionado',
  parte_de: 'Faz parte de',
  inclui: 'Inclui',
  diferenciar_de: 'Diferenciar de',
  costuma_coexistir: 'Costuma aparecer junto',
};

// O que aparece em cada página de registro.
export const REGISTRO = {
  tituloPagina: '{nome} | {base} · NeuroDados Brasil',
  migalha: ['NeuroDados', 'Bases'],
  definicao: 'Definição',
  resumo: 'Resumo',
  nomesAlternativos: 'Também chamado de',
  afirmacoes: 'Pontos principais',
  resultados: 'Principais resultados',
  faixaEtaria: 'Faixa etária',
  idade: {
    anos: '{n} anos',
    meses: '{n} meses',
    anosEMeses: '{a} anos e {m} meses',
    entre: 'de {de} a {ate}',
    aPartir: 'a partir de {de}',
  },
  instrumento: {
    titulo: 'Ficha do instrumento',
    nomeOriginal: 'Nome original',
    construtos: 'O que avalia',
    uso: 'Uso',
    usos: { privativo_do_psicologo: 'Privativo do psicólogo', nao_privativo: 'Não privativo' },
    satepsi: 'Situação no SATEPSI',
    situacoes: {
      favoravel: 'Parecer favorável',
      desfavoravel: 'Parecer desfavorável',
      nao_avaliado: 'Não avaliado',
      nao_privativo: 'Na lista dos instrumentos não privativos',
      nao_consta: 'Não consta nas listas',
    },
    normas: 'normas válidas até {data}',
    consulta: 'consulta em {data}',
    aviso: 'Este registro traz só dados públicos do instrumento. Itens, pranchas, estímulos e respostas de testes não são divulgados.',
  },
  intervencao: {
    objetivos: 'Objetivos',
    publico: 'Para quem',
    contextos: 'Onde acontece',
    profissionais: 'Quem atende',
  },
  norma: {
    titulo: 'Ficha da norma',
    tipo: 'Tipo',
    tipos: {
      constituicao: 'Constituição',
      emenda_constitucional: 'Emenda constitucional',
      tratado: 'Tratado internacional',
      lei_complementar: 'Lei complementar',
      lei: 'Lei',
      medida_provisoria: 'Medida provisória',
      decreto: 'Decreto',
      decreto_legislativo: 'Decreto legislativo',
      portaria: 'Portaria',
      portaria_de_consolidacao: 'Portaria de consolidação',
      resolucao: 'Resolução',
      resolucao_normativa: 'Resolução normativa',
      instrucao_normativa: 'Instrução normativa',
      outra: 'Outra norma',
    },
    numero: 'Número',
    data: 'Data',
    orgao: 'Órgão',
    ementa: 'Ementa',
    publicacao: 'Publicação',
    abrangencia: 'Abrangência',
    abrangencias: { federal: 'Federal', estadual: 'Estadual', municipal: 'Municipal' },
    vigencia: 'Vigência',
    situacoes: { vigente: 'Vigente', parcialmente_revogada: 'Parcialmente revogada', revogada: 'Revogada' },
    conferida: 'conferida no texto oficial em {data}',
    alteracoes: 'Alterada por',
    revogadaPor: 'Revogada por',
    regulamentadaPor: 'Regulamentada por',
    condicoes: 'A quem se refere',
    areas: 'Áreas',
    textoOficial: 'Texto oficial',
    aviso: 'Conteúdo informativo: não é orientação jurídica. O texto oficial é o que vale.',
  },
  publicacao: {
    titulo: 'A publicação',
    tituloOriginal: 'Título original',
    autores: 'Autores',
    ano: 'Ano',
    veiculo: 'Publicado em',
    tipo: 'Tipo',
    tipos: {
      diretriz_clinica: 'Diretriz clínica',
      consenso: 'Consenso',
      revisao_sistematica: 'Revisão sistemática',
      meta_analise: 'Meta-análise',
      revisao_narrativa: 'Revisão narrativa',
      estudo_populacional: 'Estudo populacional',
      estudo_primario: 'Estudo primário',
      documento_oficial: 'Documento oficial',
    },
    acessoAberto: 'Acesso aberto',
    sim: 'sim',
    nao: 'não',
    temas: 'Temas',
    populacao: 'Com quem',
    metodo: 'Como',
  },
  classificacoes: 'Classificação',
  relacionados: 'Relacionados',
  limitacoes: 'Limitações',
  fontes: 'Fontes',
  consultadoEm: 'Consultado em {data}',
  situacao: 'Situação deste registro',
  situacoes: {
    conferido_nas_fontes: 'Conferido nas fontes em {data}. Ainda sem revisão de um profissional de saúde.',
    em_revisao: 'Em revisão por profissional de saúde. Conferido nas fontes em {data}.',
    revisado: 'Revisado por {nome} ({conselho} {registro}) em {data}.',
  },
  estados: {
    desatualizado: 'Atenção: uma das fontes deste registro mudou depois da conferência. O registro está sendo atualizado.',
    arquivado: 'Este registro foi arquivado e não faz mais parte da base. Ele fica aqui para quem já o citou.',
  },
  versao: 'Versão {versao}, atualizada em {data}.',
  citar: 'Como citar',
  citacao: 'NeuroDados Brasil. {nome}. In: {base}, versão {versaoBase}. Rio de Janeiro: Clínica NeuroBee, {ano}. Disponível em: {url}. Licença CC BY 4.0.',
  dados: 'Dados deste registro',
  dadosTexto: 'O mesmo registro em JSON, pela API: {api}',
  voltar: 'Voltar para a {base}',
};

export const PAGINAS = {
  inicio: {
    titulo: 'NeuroDados Brasil | Dados abertos sobre neurodesenvolvimento',
    descricao: 'Base aberta de conceitos e condições do neurodesenvolvimento, com a fonte de cada informação, API, MCP e downloads. Mantida pela Clínica NeuroBee.',
    h1: 'NeuroDados Brasil',
    intro: 'Dados abertos sobre neurodesenvolvimento e desenvolvimento infantil, em formato que pessoas, sistemas e inteligências artificiais conseguem ler, conferir e citar.',
    secoes: [
      {
        titulo: 'O que é',
        paragrafos: [
          'O NeuroDados reúne, em formato aberto, informações sobre neurodesenvolvimento: conceitos e condições, a avaliação psicológica e neuropsicológica, as intervenções, os estudos e as leis e normas, com as fontes que sustentam cada afirmação.',
          'Cada registro diz quando foi conferido nas fontes e se já passou pela revisão de um profissional de saúde.',
        ],
      },
      {
        titulo: 'Para quem',
        paragrafos: [
          'Para famílias e escolas que procuram uma explicação clara, para profissionais e pesquisadores que precisam da fonte, e para desenvolvedores e assistentes de inteligência artificial que leem dados estruturados.',
        ],
      },
    ],
    bases: 'As bases',
    // Botão da abertura da página inicial, que leva às bases logo abaixo.
    verBases: 'Ver as bases',
    abrirBase: 'Abrir a {nome}',
    contagem: '{n} registros · versão {versao}',
    usar: {
      titulo: 'Como usar',
      itens: [
        ['Ler no site', 'Cada registro tem uma página com a definição, os pontos principais e as fontes.'],
        ['Baixar', 'A base inteira em JSON, JSONL e CSV, com o schema de cada formato.'],
        ['Consultar pela API', 'Endereços abertos, sem chave, com resposta em JSON.'],
        ['Ligar a um assistente de IA', 'O servidor MCP do NeuroDados responde com as fontes e a versão dos dados.'],
      ],
      link: 'Ver a documentação',
    },
    naoE: {
      titulo: 'O que o NeuroDados não é',
      paragrafos: [
        'Não é diagnóstico, não substitui a avaliação de um profissional e não guarda dado de paciente. Os registros explicam conceitos e citam as fontes; a decisão sobre cada criança é de quem a avalia.',
        'Também não é orientação jurídica: o NeuroDireitos resume o que cada norma diz e aponta o texto oficial, que é o que vale.',
      ],
    },
    confianca: {
      titulo: 'De onde vem cada informação',
      paragrafos: [
        'Toda afirmação aponta para a fonte que a sustenta: lei, documento do Ministério da Saúde, classificação oficial ou artigo científico. As regras estão na governança e na metodologia.',
      ],
      links: [['Governança', '/governanca'], ['Metodologia', '/metodologia']],
    },
  },

  sobre: {
    titulo: 'Sobre o NeuroDados Brasil | Quem mantém e como funciona',
    descricao: 'O NeuroDados Brasil é uma iniciativa de dados abertos mantida pela Clínica NeuroBee, com governança própria e a fonte de cada informação.',
    h1: 'Sobre o NeuroDados Brasil',
    secoes: [
      {
        titulo: 'Quem mantém',
        paragrafos: [
          'O NeuroDados Brasil é uma iniciativa de dados abertos sobre neurodesenvolvimento, desenvolvida e mantida pela Clínica NeuroBee, clínica de psicologia e avaliação neuropsicológica no Recreio dos Bandeirantes, no Rio de Janeiro, em parceria com a Otimiza.pro.',
          'A Clínica NeuroBee é a titular dos dados e do código. A Otimiza.pro desenvolve o portal, a API, o servidor MCP e a Skill, cuida da infraestrutura e faz a pesquisa, a redação e a conferência dos registros nas fontes. A revisão técnica é de profissional de saúde com registro no conselho da profissão, como diz a governança. O NeuroDados tem regras próprias, publicadas na governança e na metodologia, e elas valem acima de qualquer interesse da clínica e da Otimiza.pro.',
        ],
      },
      {
        titulo: 'Conflito de interesse',
        paragrafos: [
          'A Clínica NeuroBee presta serviços de psicologia e de avaliação neuropsicológica, e a Otimiza.pro vende software e serviços. Por isso, nenhum registro indica, recomenda ou cita a clínica, a Otimiza.pro, os profissionais ou os preços delas.',
        ],
      },
      {
        titulo: 'Dados abertos',
        paragrafos: [
          'Qualquer pessoa, clínica, escola ou empresa pode usar os dados, inclusive para fins comerciais, desde que cite a fonte, como pede a licença CC BY 4.0.',
        ],
      },
      {
        titulo: 'Contato',
        paragrafos: ['Correções, sugestões e pedidos de retirada vão para {email}.'],
      },
    ],
  },

  bases: {
    titulo: 'Bases do NeuroDados Brasil | Catálogo de dados abertos',
    descricao: 'As bases de dados abertos do NeuroDados Brasil, com a versão, a quantidade de registros e os formatos de cada uma.',
    h1: 'Bases',
    intro: 'Cada base tem schema, documentação, versão e licença. Uma base nova entra aqui quando os primeiros registros dela estiverem conferidos.',
    linhaBase: 'Versão {versao} · {n} registros · licença CC BY 4.0',
    abrir: 'Abrir',
  },

  base: {
    porBase: {
      neurobase: {
        titulo: 'NeuroBase | Conceitos e condições do neurodesenvolvimento',
        descricao: 'Conceitos e condições do neurodesenvolvimento com definição simples, pontos principais ligados às fontes e classificação CID. Dados abertos, CC BY 4.0.',
      },
      avaliabase: {
        titulo: 'AvaliaBase | Avaliação psicológica e neuropsicológica',
        descricao: 'A avaliação psicológica e neuropsicológica: o que é, as etapas, os documentos, o SATEPSI e a situação de testes nele, com a data da consulta. Dados abertos.',
      },
      intervenbase: {
        titulo: 'IntervenBase | Intervenções e atendimentos no desenvolvimento infantil',
        descricao: 'Intervenções e atendimentos no desenvolvimento infantil: o que são, para quem, quem atende, o que as evidências mostram e os limites. Dados abertos.',
      },
      evidenciabase: {
        titulo: 'EvidenciaBase | Estudos e diretrizes sobre neurodesenvolvimento',
        descricao: 'Estudos, revisões e diretrizes sobre neurodesenvolvimento, com os metadados e um resumo de cada publicação: população, método, resultados e limites.',
      },
      neurodireitos: {
        titulo: 'NeuroDireitos | Leis e normas sobre neurodesenvolvimento e deficiência',
        descricao: 'Leis, decretos e normas federais sobre neurodesenvolvimento, deficiência, saúde mental e doenças: o que garantem, a vigência e o texto oficial. Dados abertos.',
      },
    },
    registros: 'Os registros',
    baixar: 'Baixar e consultar',
    downloads: [
      ['JSON', 'a base inteira, numa lista'],
      ['JSONL', 'um registro por linha'],
      ['CSV', 'uma linha por registro, com os campos principais'],
      ['Schema', 'o formato de cada registro, em JSON Schema'],
      ['API', 'a mesma base, registro a registro'],
    ],
    // Linhas da mesma tabela, quando a base já está no repositório.
    repositorios: [
      ['Zenodo', 'esta versão arquivada, com DOI'],
      ['Hugging Face', 'a mesma base, para ciência de dados e IA'],
      ['GitHub', 'o código, os schemas e o histórico das versões'],
    ],
    citar: 'Como citar',
    citacao: 'NeuroDados Brasil. {titulo}, versão {versao}. Rio de Janeiro: Clínica NeuroBee, {ano}. Disponível em: {url}. Licença CC BY 4.0.',
    citacaoDoi: 'NeuroDados Brasil. {titulo}, versão {versao}. Rio de Janeiro: Clínica NeuroBee, {ano}. DOI: {doi}. Disponível em: {url}. Licença CC BY 4.0.',
    limitacoes: 'Limitações',
    versoes: 'Versões',
  },

  governanca: {
    titulo: 'Governança do NeuroDados Brasil | Regras, revisão e correções',
    descricao: 'Como o NeuroDados Brasil escolhe as fontes, confere e revisa cada registro, corrige erros e separa os dados abertos dos interesses da clínica que o mantém.',
    h1: 'Governança',
    secoes: [
      {
        titulo: 'Princípios',
        itens: [
          'Transparência: as regras, as fontes e a situação de cada registro ficam à vista.',
          'Rastreabilidade: toda afirmação aponta para a fonte que a sustenta, com a data da consulta.',
          'Reprodutibilidade: as bases têm versão e histórico, e quem baixa uma versão encontra os mesmos dados depois.',
          'Independência editorial: os registros não mudam para favorecer serviço ou produto de ninguém.',
          'Respeito à lei e à privacidade: nenhum dado de paciente entra no NeuroDados.',
        ],
      },
      {
        titulo: 'Quem decide',
        paragrafos: [
          'A Clínica NeuroBee mantém o NeuroDados e aprova a publicação de cada versão. A revisão técnica é feita por profissional de saúde com registro no conselho da profissão, e cada registro revisado mostra o nome e o registro de quem revisou.',
        ],
      },
      {
        titulo: 'A situação de cada registro',
        paragrafos: ['Cada registro tem um estado e uma situação de revisão.'],
        itens: [
          'Publicado: o registro está no ar.',
          'Desatualizado: o registro segue no ar, com o aviso de que uma fonte mudou e ele está sendo atualizado.',
          'Arquivado: o registro sai da base, e o endereço segue respondendo com o aviso, para quem já o citou.',
          'Conferido nas fontes: cada afirmação foi conferida na fonte citada, sem a revisão de um profissional de saúde.',
          'Em revisão: um profissional de saúde está revisando o registro.',
          'Revisado: um profissional de saúde com registro no conselho revisou o registro e assina a revisão.',
        ],
      },
      {
        titulo: 'Fontes aceitas',
        paragrafos: ['Nesta ordem de preferência:'],
        itens: [
          'Órgãos oficiais e classificações oficiais, como leis, documentos do Ministério da Saúde e a Classificação Internacional de Doenças.',
          'Diretrizes clínicas de órgãos públicos e de organizações científicas.',
          'Revisões sistemáticas e meta-análises.',
          'Artigos revisados por pares.',
          'Instituições acadêmicas.',
          'Organizações profissionais reconhecidas.',
        ],
        depois: 'O que não tem fonte adequada não entra como fato.',
      },
      {
        titulo: 'O que nunca entra',
        itens: [
          'Dado de paciente: prontuário, laudo, resultado de teste, relato clínico, foto ou vídeo.',
          'Itens, pranchas, estímulos ou respostas de testes psicológicos.',
          'Texto copiado de manual ou de artigo protegido por direito autoral.',
          'Indicação de clínica, de profissional ou de serviço.',
        ],
      },
      {
        titulo: 'Correções e retirada',
        paragrafos: [
          'Achou um erro? Escreva para {email} com o endereço do registro e a fonte que mostra o erro. A correção sai numa nova versão do registro, com a mudança no histórico.',
          'Se um dia uma base trouxer dado pessoal, como o nome de um profissional, o pedido de correção ou de retirada é atendido como manda a Lei Geral de Proteção de Dados Pessoais.',
        ],
      },
      {
        titulo: 'Conflito de interesse',
        paragrafos: [
          'A Clínica NeuroBee presta serviços de psicologia e de avaliação neuropsicológica. Nenhum registro indica, recomenda ou cita a clínica, os profissionais dela ou os preços dela.',
        ],
      },
      {
        titulo: 'Uso de inteligência artificial',
        paragrafos: [
          'Os registros são redigidos com apoio de ferramentas de inteligência artificial. Antes da publicação, cada afirmação é conferida na fonte citada, e a versão só vai ao ar com a aprovação da equipe.',
        ],
      },
    ],
  },

  metodologia: {
    titulo: 'Metodologia do NeuroDados Brasil | Como cada registro é feito',
    descricao: 'O passo a passo de cada registro do NeuroDados Brasil: escolha das fontes, redação, conferência, revisão, versão, identificadores e formatos.',
    h1: 'Metodologia',
    passos: [
      ['Escolha do tema', 'Entram temas de neurodesenvolvimento e de desenvolvimento infantil que tenham fonte primária disponível.'],
      ['Leitura das fontes', 'A lei é lida no texto oficial; o documento do Ministério da Saúde, na publicação do próprio Ministério; a classificação, na fonte oficial; o artigo científico, pelo DOI e pelo resumo publicado.'],
      ['Redação', 'A definição é escrita pela equipe, em linguagem simples. Os pontos principais são curtos e cada um aponta para a fonte. Trecho literal só de lei e de norma, entre aspas.'],
      ['Conferência', 'Cada afirmação é conferida na fonte citada antes da publicação, e a data da consulta fica na fonte.'],
      ['Revisão', 'Quando um profissional de saúde revisa o registro, ele passa a revisado, com o nome e o registro de quem revisou.'],
      ['Publicação e versão', 'Cada base tem versão por data (AAAA.MM.DD). Cada registro tem a própria versão e o próprio histórico. O identificador, como neurobase.tea, não muda depois de publicado.'],
      ['Validação automática', 'Um validador confere o formato de cada registro (JSON Schema), a ligação entre as afirmações e as fontes, as relações entre registros e as regras de texto.'],
    ],
    secoes: [
      {
        titulo: 'Classificações',
        paragrafos: [
          'A CID-10 ainda é a classificação usada em muitos sistemas de saúde no Brasil, e a CID-11 está em vigor na Organização Mundial da Saúde desde 1º de janeiro de 2022. Quando um registro traz um código, ele vem com a fonte em que foi conferido.',
        ],
      },
      {
        titulo: 'Formatos',
        paragrafos: [
          'Os dados saem em JSON, JSONL e CSV, com o formato de cada registro descrito em JSON Schema. A mesma base responde pela API e pelo servidor MCP.',
        ],
      },
    ],
  },

  licencas: {
    titulo: 'Licenças do NeuroDados Brasil | Como usar os dados e o código',
    descricao: 'Os dados do NeuroDados Brasil estão sob a licença CC BY 4.0, com uso comercial permitido e a citação da fonte. O código está sob a licença MIT.',
    h1: 'Licenças',
    secoes: [
      {
        titulo: 'Dados',
        paragrafos: [
          'Os registros e as bases estão sob a licença Creative Commons Atribuição 4.0 Internacional (CC BY 4.0). Você pode copiar, adaptar e usar os dados, inclusive para fins comerciais, desde que cite a fonte e indique se fez mudanças.',
        ],
      },
      {
        titulo: 'Como citar',
        paragrafos: ['NeuroDados Brasil, Clínica NeuroBee. Nome da base, versão. Endereço do registro ou da base. Licença CC BY 4.0.'],
      },
      {
        titulo: 'Código',
        paragrafos: ['O código do portal, da API e do servidor MCP está sob a licença MIT.'],
      },
      {
        titulo: 'Conteúdo de terceiros',
        paragrafos: [
          'Leis e normas são de domínio público e aparecem com a fonte. Classificações e artigos de terceiros seguem as licenças deles: o NeuroDados cita o código, o título e a referência, e escreve a explicação com as próprias palavras.',
        ],
      },
      {
        titulo: 'Marcas',
        paragrafos: [
          'As marcas NeuroDados Brasil e NeuroBee não fazem parte das licenças. Usar os dados não dá direito de usar as marcas, nem de apresentar o uso como parceria ou endosso.',
        ],
      },
    ],
  },

  contribuicoes: {
    titulo: 'Contribuições ao NeuroDados Brasil | Como sugerir e corrigir',
    descricao: 'Como pesquisadores, profissionais de saúde e de educação, desenvolvedores e instituições podem sugerir correções e novos registros ao NeuroDados Brasil.',
    h1: 'Contribuições',
    secoes: [
      {
        titulo: 'Quem pode contribuir',
        paragrafos: [
          'Pesquisadores, psicólogos, neuropsicólogos, fonoaudiólogos, terapeutas ocupacionais, médicos, profissionais da educação, desenvolvedores e instituições.',
        ],
      },
      {
        titulo: 'Como contribuir',
        paragrafos: [
          'Escreva para {email} com o endereço do registro, o que deve mudar e a fonte que sustenta a mudança.',
          'Profissionais de saúde que quiserem revisar registros podem se oferecer pelo mesmo endereço, com o número do registro no conselho.',
        ],
      },
      {
        titulo: 'O que acontece depois',
        paragrafos: [
          'Toda contribuição passa pela mesma conferência dos registros: a fonte é lida, a mudança entra numa nova versão e o histórico registra o que mudou. Quem contribuiu pode ser citado no histórico, se quiser.',
        ],
      },
      {
        titulo: 'O que não aceitamos',
        itens: [
          'Dado de paciente.',
          'Itens, pranchas ou respostas de testes psicológicos.',
          'Texto copiado de manual ou de artigo protegido.',
          'Indicação de clínica, de profissional ou de serviço.',
        ],
      },
    ],
  },

  documentacao: {
    titulo: 'Documentação do NeuroDados Brasil | API, MCP e downloads',
    descricao: 'Como consultar o NeuroDados Brasil pela API aberta, ligar o servidor MCP a um assistente de IA e baixar as bases em JSON, JSONL e CSV.',
    h1: 'Documentação',
    api: {
      titulo: 'API',
      paragrafos: [
        'A API é aberta, sem chave, e responde em JSON, de qualquer origem. O endereço base é {api}.',
        'Toda resposta traz a versão dos dados, a licença, como citar e o aviso de que o conteúdo é informativo.',
      ],
      endpoints: [
        ['GET /api/v1', 'O índice da API, com as bases e os endereços.'],
        ['GET /api/v1/bases', 'O catálogo das bases.'],
        ['GET /api/v1/{base}', 'Os registros de uma base (neurobase, avaliabase, intervenbase, evidenciabase ou neurodireitos), com os filtros q (busca), categoria, pagina e por_pagina (até 100). No NeuroDireitos, também condicao e area.'],
        ['GET /api/v1/{base}/{slug}', 'Um registro completo, como /api/v1/neurobase/tea.'],
        ['GET /api/v1/openapi.json', 'A descrição da API em OpenAPI 3.1.'],
      ],
      exemplo: 'Exemplo',
    },
    mcp: {
      titulo: 'Servidor MCP',
      paragrafos: [
        'O servidor MCP deixa um assistente de inteligência artificial consultar o NeuroDados direto, sem autenticação, pelo transporte HTTP do protocolo. O endereço é {mcp}.',
        'As respostas trazem as fontes, a versão dos dados e a situação da revisão de cada registro.',
      ],
      ferramentas: 'Ferramentas',
    },
    skill: {
      titulo: 'Skill',
      paragrafos: [
        'A Skill do NeuroDados explica a um assistente de inteligência artificial como consultar a base, citar as fontes e lidar com o que a base não cobre.',
      ],
      link: 'Baixar a Skill (SKILL.md)',
    },
    downloads: {
      titulo: 'Downloads e schemas',
      paragrafos: ['Os arquivos mudam só quando sai uma versão nova da base. Para uso intenso, prefira baixar a base inteira.'],
    },
    repositorios: {
      titulo: 'Repositórios',
      paragrafos: [
        'O código do portal, da API e do servidor MCP, os schemas e o histórico das versões estão no GitHub, em {github}.',
        'Cada base também está no Zenodo, com um DOI por versão, e no Hugging Face, para ciência de dados e IA.',
      ],
    },
    llms: {
      titulo: 'Para modelos de linguagem',
      paragrafos: ['O resumo do NeuroDados para modelos de linguagem fica em {llms}.'],
    },
  },

  atualizacoes: {
    titulo: 'Atualizações do NeuroDados Brasil | Versões e mudanças',
    descricao: 'O histórico das versões das bases do NeuroDados Brasil, com o que mudou em cada uma.',
    h1: 'Atualizações',
    intro: 'Cada versão de uma base e cada mudança de registro aparecem aqui, da mais recente para a mais antiga.',
  },

  naoEncontrada: {
    titulo: 'Página não encontrada | NeuroDados Brasil',
    h1: 'Página não encontrada',
    texto: 'Este endereço não existe no NeuroDados. Veja as bases ou a documentação.',
  },
};

// Ferramentas do servidor MCP: o nome é técnico; a descrição é texto público.
export const FERRAMENTAS_MCP = {
  listar_bases: 'Lista as bases do NeuroDados Brasil, com a versão e a quantidade de registros de cada uma.',
  buscar_conceito: 'Busca na NeuroBase conceitos e condições do neurodesenvolvimento pelo nome, pela sigla ou por palavras da definição. Devolve os registros com a definição e o endereço.',
  consultar_registro: 'Devolve um registro completo de qualquer base, com as afirmações, as fontes, a classificação e a situação da revisão. Aceita o id, como neurobase.tea ou avaliabase.satepsi.',
  consultar_tea: 'Devolve o registro do Transtorno do Espectro Autista (TEA) na NeuroBase.',
  consultar_tdah: 'Devolve o registro do Transtorno do Déficit de Atenção com Hiperatividade (TDAH) na NeuroBase.',
  buscar_avaliacao: 'Busca na AvaliaBase conceitos, etapas, documentos e orientações da avaliação psicológica e neuropsicológica.',
  buscar_instrumento: 'Busca na AvaliaBase um instrumento de avaliação pelo nome ou pela sigla e devolve a situação dele no SATEPSI, com a data da consulta. Não devolve itens nem respostas de testes.',
  buscar_intervencao: 'Busca na IntervenBase intervenções e atendimentos no desenvolvimento infantil, com o que as evidências mostram e os limites de cada um.',
  buscar_evidencias: 'Busca na EvidenciaBase estudos, revisões e diretrizes pelo tema, pelo título ou pelo autor, com os metadados e o resumo de cada publicação.',
  buscar_norma: 'Busca no NeuroDireitos leis, decretos e normas federais sobre neurodesenvolvimento, deficiência, saúde mental e doenças, pelo número, pelo nome ou pelo assunto. Devolve o que cada norma garante, a vigência e o endereço do texto oficial. Não é orientação jurídica.',
};

// Mensagens que a API e o servidor MCP devolvem.
export const MENSAGENS = {
  fonte: 'NeuroDados Brasil, mantido pela Clínica NeuroBee',
  apiMetodo: 'Método não permitido. A API só lê: use GET.',
  apiVersao: 'Versão da API não encontrada. Use /neurodados/api/v1.',
  naoEncontrado: 'Endereço não encontrado.',
  registroNaoEncontrado: 'Registro não encontrado.',
  categoriaDesconhecida: 'Categoria desconhecida.',
  mcpGet: 'Servidor MCP do NeuroDados. Envie as mensagens JSON-RPC por POST.',
  mcpInformeConsulta: 'Informe a consulta.',
  mcpInformeId: 'Informe o id ou o slug.',
  mcpFerramenta: 'Ferramenta desconhecida: {nome}.',
  mcpSemRegistro: 'Registro não encontrado: {chave}. Use buscar_conceito para achar o id.',
  mcpSemResultado: 'Nenhum registro encontrado para "{consulta}". Veja a lista completa em {url}.',
  mcpDicaFontes: 'Use consultar_registro para ver as fontes de cada um.',
  mcpBase: '{nome}: {titulo}. {n} registros, versão {versao}. {url}',
  mcpRevisado: 'revisado por {nome} ({conselho} {registro}) em {data}',
  mcpConferido: 'conferido nas fontes em {data}, ainda sem revisão de profissional de saúde',
  mcpEmRevisao: 'em revisão por profissional de saúde, conferido nas fontes em {data}',
  mcpVersaoRegistro: 'Versão {versao}, de {data}.',
  mcpEndereco: 'Endereço: {url}',
  mcpVersaoBase: 'Versão da base: {versao}. Licença: {licenca}.',
  parametroConsulta: 'Nome, sigla ou palavras, como "autismo" ou "funções executivas".',
  parametroCategoria: 'Filtra pela categoria.',
  parametroTema: 'Filtra pelo tema.',
  parametroCondicao: 'Filtra pela condição ou pelo público a que a norma se refere.',
  parametroArea: 'Filtra pela área, como educação, saúde ou assistência social.',
  filtroDesconhecido: 'Filtro desconhecido.',
  parametroLimite: 'Quantos registros devolver, de 1 a 20.',
  parametroId: 'O id, como neurobase.tea ou avaliabase.satepsi. O slug sozinho, como tea, procura na NeuroBase.',
  parametroQ: 'Busca pelo nome, pela sigla ou por palavras da definição.',
  parametroPagina: 'A página da lista, começando em 1.',
  parametroPorPagina: 'Quantos registros por página, de 1 a 100.',
  parametroSlug: 'O slug (como tea) ou o id (como neurobase.tea) do registro.',
};

// O que entra no site da clínica (aplicado pela sessão Site NeuroBee, no gerador dela).
export const NO_SITE = {
  rodapeLink: 'NeuroDados Brasil',
  llmsLinha: '[NeuroDados Brasil](https://clinicaneurobee.com.br/neurodados): dados abertos sobre neurodesenvolvimento, com a fonte de cada informação, mantidos pela Clínica NeuroBee. Resumo para modelos de linguagem: https://clinicaneurobee.com.br/neurodados/llms.txt',
};

export const INSTRUCOES_MCP = 'NeuroDados Brasil: dados abertos sobre neurodesenvolvimento, mantidos pela Clínica NeuroBee, em bases temáticas (use listar_bases). Cite a fonte de cada afirmação e a versão dos dados. Diga se o registro foi só conferido nas fontes ou revisado por profissional. O conteúdo é informativo: não use para diagnóstico nem para indicar tratamento, e recomende a avaliação de um profissional habilitado quando a pergunta for sobre uma pessoa.';

// A página "Regulação de Neurodados" (dados neurais), gerada do rascunho conferido nas fontes em 9/11/2026.
// Chamadas [n] apontam para a lista de fontes; **texto** sai em negrito.
export const REGULACAO = {
  "titulo": "Regulação de Neurodados: Proteção e Ética em 2026 | NeuroDados Brasil",
  "descricao": "Neurodados (dados neurais): o que a LGPD já cobre, as propostas no Congresso e as regras de Chile, EUA, UNESCO, OCDE e ONU. Com fontes e datas.",
  "h1": "Regulação de Neurodados: Proteção e Ética em 2026",
  "data": "Informações conferidas em 9 de novembro de 2026.",
  "intro": [
    "No debate público, \"neurodados\" quer dizer dados neurais: informações tiradas do cérebro e do sistema nervoso por neurotecnologias [1][5]. As fontes estão no fim. Esta página informa e não é orientação jurídica."
  ],
  "secoes": [
    {
      "titulo": "O que são neurodados",
      "blocos": [
        {
          "p": "Não há um nome único: estudos e instituições falam em dados cerebrais, dados neurais ou neurodados [1]. Um estudo publicado pela ANPD em 2025 define dados neurais como os dados coletados do cérebro, os relativos à composição, à atividade e ao funcionamento do sistema nervoso humano e as inferências obtidas a partir deles [1]."
        },
        {
          "p": "A UNESCO inclui nos dados neurais as medidas diretas da atividade dos neurônios, como os sinais do eletroencefalograma (EEG), e indicadores indiretos, como o fluxo de sangue medido pela ressonância magnética funcional [2]. Esses dados vêm das neurotecnologias, ferramentas que medem, modulam ou estimulam o sistema nervoso [3]. Elas vão de implantes e interfaces cérebro-máquina a aparelhos de consumo, como faixas de cabeça e fones conectados [2][3]."
        }
      ]
    },
    {
      "titulo": "Por que a regulação ganhou força",
      "blocos": [
        {
          "p": "Segundo a UNESCO, o uso médico das neurotecnologias segue regras rígidas, mas em outras áreas é pouco regulado. O investimento em empresas do setor cresceu 700% entre 2014 e 2021 [3]. Em 2024, o Comitê Consultivo do Conselho de Direitos Humanos da ONU registrou que a indústria se volta para aparelhos vendidos direto ao consumidor, um setor muito desregulado. Segundo o comitê, essas empresas já coletam quantidades desconhecidas de dados pessoais [4]."
        },
        {
          "p": "A UNESCO trata a privacidade mental como fundamental para a identidade pessoal [2]. Os dados neurais podem revelar pensamentos, emoções e reações [3] e, combinados com outros dados, ajudam a inferir estados mentais [1]."
        }
      ]
    },
    {
      "titulo": "O que já vale no Brasil",
      "blocos": [
        {
          "p": "**LGPD.** A Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) não define dado neural [1][8]. Dado pessoal é a informação relacionada a pessoa natural identificada ou identificável (art. 5º, I). Entre os dados sensíveis estão o dado referente à saúde e o dado genético ou biométrico, quando vinculado a uma pessoa natural (art. 5º, II), com regras próprias no art. 11 [8]."
        },
        {
          "p": "O estudo Radar Tecnológico nº 4, publicado pela ANPD em junho de 2025, conclui que os dados neurais de pessoa identificada ou identificável são dados pessoais. Eles podem ser sensíveis quando revelam aspectos do art. 5º, II, como a saúde, e a análise depende do contexto [1]. O estudo afirma ainda que o consentimento dificilmente será a base adequada no trabalho e na escola, pela assimetria entre as partes. A série não firma posição institucional da ANPD [1]. No balanço de agosto de 2026, a Agenda Regulatória 2025-2026 da ANPD não tinha item próprio sobre dados neurais [31]."
        },
        {
          "p": "**Constituição Federal.** Desde a Emenda Constitucional nº 115/2022, o art. 5º, LXXIX, assegura o direito à proteção dos dados pessoais, nos termos da lei [9]."
        },
        {
          "p": "**Rio Grande do Sul.** A Emenda Constitucional nº 85/2023 está em vigor desde 21 de dezembro de 2023. Por ela, a Constituição gaúcha passou a dizer que a política e a pesquisa científica e tecnológica se baseiam no respeito à vida, à dignidade humana e \"à integridade mental do ser humano\", entre outros valores. O texto não cita dados neurais nem neurotecnologia [10]."
        }
      ]
    },
    {
      "titulo": "O que está em discussão no Congresso",
      "blocos": [
        {
          "p": "Nenhuma das propostas abaixo tinha sido aprovada até 9 de novembro de 2026 [11][12][13][14][15]."
        },
        {
          "lista": [
            "**PEC 29/2023 (Senado).** Do senador Randolfe Rodrigues e de outros 26 senadores. Põe no art. 5º da Constituição que \"o desenvolvimento científico e tecnológico assegurará a integridade mental e a transparência algorítmica, nos termos da lei\". Aguarda relator na Comissão de Constituição, Justiça e Cidadania desde 26 de junho de 2023 [11].",
            "**PL 522/2022 (Câmara).** Do deputado Carlos Henrique Gaguim. Define dado neural na LGPD, põe esse dado entre os sensíveis e cria regras, como consentimento específico e destacado e a proibição de compartilhar esses dados para obter vantagem econômica. Na Comissão de Saúde, a relatora, deputada Adriana Ventura, deu parecer pela aprovação com substitutivo em outubro de 2024; com emendas ao substitutivo, o projeto voltou a ela em dezembro de 2024 [12].",
            "**PL 6687/2025 (Câmara).** Do deputado Amom Mandel. Também inclui os dados neurais entre os sensíveis, veda usos abusivos no trabalho e na educação e dá à ANPD competência para regular o tema. Tramita em conjunto com o PL 522/2022 desde março de 2026 [13].",
            "**PL 2174/2023 (Câmara).** Do deputado Rubens Pereira Júnior. Lista \"neurodireitos\", como a privacidade cerebral e neurológica e a liberdade cognitiva. Aguarda relator na Comissão de Constituição e Justiça e de Cidadania desde junho de 2023 [14].",
            "**PL 4/2025 (Senado).** Atualização do Código Civil, do senador Rodrigo Pacheco. O texto inicial trata os neurodireitos como parte da personalidade, prevê a liberdade cognitiva e a privacidade mental e proíbe a venda ou transferência comercial de dados cerebrais. Também põe a privacidade mental, a liberdade cognitiva e a integridade mental entre os fundamentos da LGPD. Está com o relator, senador Veneziano Vital do Rêgo, em comissão temporária com prazo até 22 de dezembro de 2026 [15]."
          ]
        },
        {
          "p": "Os PLs 1221/2021 e 1229/2021, com a mesma ementa do PL 522/2022, foram retirados pelo próprio autor [16][32]."
        }
      ]
    },
    {
      "titulo": "No mundo",
      "blocos": [
        {
          "p": "**Chile.** A Lei nº 21.383, de outubro de 2021, mudou o art. 19 da Constituição chilena: a lei que regular a ciência e a tecnologia aplicadas às pessoas deve resguardar \"especialmente a atividade cerebral, assim como a informação proveniente dela\" (tradução livre) [17]. Em 9 de agosto de 2023, a Corte Suprema chilena (rol nº 105.065-2023) mandou a empresa Emotiv apagar as informações sobre o uso do aparelho Insight pelo autor da ação. Também mandou as autoridades de saúde e de aduana avaliarem o aparelho [18]."
        },
        {
          "p": "**Estados Unidos.** Leis estaduais passaram a proteger os dados neurais de forma específica:"
        },
        {
          "lista": [
            "Colorado: dados biológicos, inclusive os neurais, passaram a ser dados sensíveis (HB24-1058, sancionada em 17 de abril de 2024) [19].",
            "Califórnia: dados neurais passaram a ser informação pessoal sensível (SB 1223, em vigor desde 1º de janeiro de 2025) [20][21].",
            "Montana: dados de neurotecnologia entraram na lei de privacidade genética (SB 163, de 2025) [22].",
            "Connecticut: dados neurais estão entre os dados sensíveis da lei de privacidade [23].",
            "Vermont: lei sobre direitos neurológicos e inteligência artificial em saúde e serviços sociais, sancionada em 2026 (H.814) [24].",
            "Delaware: lei sancionada em 2026 torna os dados neurais sensíveis a partir de 1º de janeiro de 2027 (HB 380) [25]."
          ]
        },
        {
          "p": "No Congresso americano, o MIND Act (S. 2925), apresentado em setembro de 2025, seguia em comissão [26]."
        },
        {
          "p": "**UNESCO.** Em novembro de 2025, a Conferência Geral da UNESCO, em Samarcanda (Uzbequistão), adotou a Recomendação sobre a Ética da Neurotecnologia [2][3]. O texto pede consentimento prévio, livre e informado para coletar e usar dados neurais, salvo em emergência médica com risco de vida, e trata da proteção de menores de 18 anos [2]. A UNESCO também alerta contra o uso no trabalho para monitorar a produtividade [3]."
        },
        {
          "p": "**OCDE.** Em 11 de dezembro de 2019, a OCDE adotou a Recomendação sobre Inovação Responsável em Neurotecnologia, com nove princípios, entre eles proteger os \"dados cerebrais pessoais\". As recomendações da OCDE não são juridicamente vinculantes [27]."
        },
        {
          "p": "**ONU.** O Conselho de Direitos Humanos aprovou resoluções sobre neurotecnologia e direitos humanos em 2022 e em 2025 [6][7]. Em 2025, a relatora especial sobre o direito à privacidade propôs princípios para regular os neurodados, reconhecidos como dados pessoais altamente sensíveis [5]. A resolução de 2025 pediu diretrizes para aplicar as normas de direitos humanos às neurotecnologias, a serem apresentadas na 64ª sessão do Conselho [7]."
        }
      ]
    },
    {
      "titulo": "Ética: os princípios em debate",
      "blocos": [
        {
          "lista": [
            "Em 2017, Marcello Ienca e Roberto Andorno propuseram quatro novos direitos: liberdade cognitiva, privacidade mental, integridade mental e continuidade psicológica [28].",
            "Rafael Yuste, Jared Genser e Stephanie Herrmann propuseram cinco \"neurodireitos\": identidade, agência (liberdade de pensamento e livre-arbítrio), privacidade mental, acesso justo ao aumento das capacidades mentais e proteção contra vieses de algoritmos [29]. Yuste e Genser estão entre os criadores da Neurorights Foundation, entidade sem fins lucrativos dos EUA [30].",
            "A OCDE define liberdade cognitiva como o direito à autodeterminação mental [27].",
            "A UNESCO organiza o tema em valores e princípios, como autonomia e liberdade de pensamento, proteção de dados neurais, não discriminação e proteção das crianças e das gerações futuras [2]."
          ]
        },
        {
          "p": "O estudo da ANPD descreve três correntes: criar novos direitos, os neurodireitos; reinterpretar os direitos existentes, sem criar novos; ou entender que o direito atual, como é interpretado hoje, já basta. O estudo não toma posição entre elas [1]."
        }
      ]
    },
    {
      "titulo": "E o NeuroDados Brasil?",
      "blocos": [
        {
          "p": "O NeuroDados Brasil é uma iniciativa de dados abertos sobre neurodesenvolvimento, como o transtorno do espectro autista (TEA) e o transtorno de déficit de atenção e hiperatividade (TDAH), mantida pela Clínica NeuroBee. Não coleta dados neurais nem dados de pacientes. Reúne informações públicas, com a fonte de cada afirmação. Apesar da semelhança, o nome não tem relação com os dados neurais tratados nesta página."
        }
      ]
    }
  ],
  "tabela": {
    "depoisDaSecao": 4,
    "titulo": "Situação em 9 de novembro de 2026",
    "colunas": [
      "Número",
      "O que é",
      "Situação",
      "Fonte"
    ],
    "linhas": [
      [
        "Lei nº 13.709/2018 (LGPD)",
        "Lei geral de proteção de dados. Não define dado neural; prevê dado pessoal sensível (art. 5º, II) e regras próprias para ele (art. 11)",
        "Em vigor",
        "[8]"
      ],
      [
        "Emenda Constitucional nº 115/2022",
        "Inclui a proteção de dados pessoais entre os direitos fundamentais (art. 5º, LXXIX)",
        "Em vigor",
        "[9]"
      ],
      [
        "Emenda Constitucional nº 85/2023 (RS)",
        "Nova redação do art. 235, parágrafo único, da Constituição do RS, que põe a \"integridade mental do ser humano\" entre as bases da política e da pesquisa científica e tecnológica",
        "Em vigor desde a publicação no DOAL nº 13.168, de 21/12/2023",
        "[10]"
      ],
      [
        "Radar Tecnológico nº 4 (ANPD, jun. 2025)",
        "Estudo técnico sobre neurotecnologias e LGPD, sem posição institucional",
        "Publicado; não é norma",
        "[1]"
      ],
      [
        "PEC 29/2023 (Senado)",
        "Integridade mental e transparência algorítmica no art. 5º da Constituição",
        "Aguardando designação de relator na CCJ do Senado desde 26/06/2023",
        "[11]"
      ],
      [
        "PL 522/2022 (Câmara)",
        "Define dado neural na LGPD, inclui entre os sensíveis e cria regras de tratamento",
        "Aguardando parecer da relatora na Comissão de Saúde. Parecer pela aprovação com substitutivo em 23/10/2024; devolvido à relatora em 12/12/2024 (emendas ao substitutivo); último andamento em 16/03/2026 (apensação do PL 6687/2025). Sujeito à apreciação conclusiva pelas comissões",
        "[12]"
      ],
      [
        "PL 6687/2025 (Câmara)",
        "Dados neurais como sensíveis; veda usos abusivos no trabalho e na educação; competência da ANPD",
        "Tramitando em conjunto com o PL 522/2022 (apensação despachada em 13/03/2026)",
        "[13]"
      ],
      [
        "PL 2174/2023 (Câmara)",
        "Normas e princípios de \"neurodireitos\"",
        "Aguardando designação de relator na CCJC desde 14/06/2023",
        "[14]"
      ],
      [
        "PL 4/2025 (Senado)",
        "Atualização do Código Civil; neurodireitos como direitos da personalidade; novo fundamento no art. 2º da LGPD",
        "Com o relator (senador Veneziano Vital do Rêgo) desde 04/03/2026, na comissão temporária; prazo da comissão prorrogado até 22/12/2026",
        "[15]"
      ],
      [
        "PL 1229/2021 (Câmara)",
        "Mesma ementa do PL 522/2022",
        "Retirado pelo autor em 15/03/2022",
        "[16]"
      ],
      [
        "PL 1221/2021 (Câmara)",
        "Mesma ementa do PL 522/2022",
        "Retirado pelo autor em 28/04/2021",
        "[32]"
      ]
    ]
  },
  "fontesTitulo": "Fontes",
  "fontesNota": "Todas consultadas em 2026-11-09.",
  "fontes": [
    {
      "titulo": "Radar Tecnológico nº 4: Neurotecnologias.",
      "resto": "ANPD (equipe: Diego Carvalho Machado, Angela Halen Claro Franco e Eduardo André Viana Alves). Brasília, junho de 2025. https://www.gov.br/anpd/pt-br/centrais-de-conteudo/documentos-tecnicos-orientativos/radar-tecnologico-4-neurotecnologias.pdf/@@download/file. Onde: p. 5 (\"sobre a série\": sem posicionamento institucional); p. 9 e 10 (três correntes e ausência de posição da ANPD); p. 16 (nomenclatura); p. 17 (combinação com dados não neurais); p. 18 (definição de dados neurais); p. 22 a 26 (dado pessoal, dado sensível, análise contextual); p. 32 (consentimento no trabalho e na escola); p. 46 (considerações finais)."
    },
    {
      "titulo": "Recommendation on the Ethics of Neurotechnology.",
      "resto": "UNESCO, Conferência Geral, 43ª sessão, Samarcanda, 2025. https://www.unesco.org/en/legal-affairs/recommendation-ethics-neurotechnology. Onde: cabeçalho da página (\"Date and place of adoption\"); preâmbulo; parágrafos 4 e 5 (neurotecnologia e dados neurais); seção III (valores e princípios): III.2.2, III.2.3 (parágrafos 48 e 49: privacidade mental e consentimento), III.2.4 e III.2.8 (parágrafo 63: crianças, menores de 18 anos)."
    },
    {
      "titulo": "Ethics of neurotechnology: UNESCO adopts the first global standard in the cutting-edge technology.",
      "resto": "UNESCO, comunicado de imprensa, 5 de novembro de 2025 (atualizado em 8 de novembro de 2025). https://www.unesco.org/en/articles/ethics-neurotechnology-unesco-adopts-first-global-standard-cutting-edge-technology. Onde: corpo do texto (definição de neurotecnologia; investimento de 700% entre 2014 e 2021; uso médico regulado e demais usos pouco regulados; aparelhos de consumo; pensamentos, emoções e reações; uso no trabalho; entrada em vigor em 12 de novembro)."
    },
    {
      "titulo": "Impact, opportunities and challenges of neurotechnology with regard to the promotion and protection of all human rights (A/HRC/57/61).",
      "resto": "ONU, Conselho de Direitos Humanos, Comitê Consultivo, 8 de agosto de 2024 (reemitido em 2 de outubro de 2024). https://docs.un.org/en/A/HRC/57/61. Onde: parágrafo 12 (p. 4) e parágrafo 25 (p. 7)."
    },
    {
      "titulo": "Foundations and principles for the regulation of neurotechnologies and the processing of neurodata from the perspective of the right to privacy (A/HRC/58/58).",
      "resto": "ONU, Relatora Especial sobre o direito à privacidade, Ana Brian Nougrères, 16 de janeiro de 2025. https://docs.un.org/en/A/HRC/58/58. Onde: resumo (Summary); parágrafo 27 (definições, inclusive \"neurodata\")."
    },
    {
      "titulo": "Resolução 51/3, Neurotechnology and human rights (A/HRC/RES/51/3).",
      "resto": "ONU, Conselho de Direitos Humanos, adotada em 6 de outubro de 2022. https://docs.un.org/en/A/HRC/RES/51/3. Onde: parágrafo operativo 1."
    },
    {
      "titulo": "Resolução 58/6, Neurotechnology and human rights (A/HRC/RES/58/6).",
      "resto": "ONU, Conselho de Direitos Humanos, adotada em 2 de abril de 2025. https://docs.un.org/en/A/HRC/RES/58/6. Onde: parágrafos operativos 1 a 3."
    },
    {
      "titulo": "Lei nº 13.709, de 14 de agosto de 2018 (LGPD).",
      "resto": "Presidência da República, Planalto. https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm. Onde: art. 5º, I e II; art. 11."
    },
    {
      "titulo": "Emenda Constitucional nº 115, de 10 de fevereiro de 2022.",
      "resto": "Presidência da República, Planalto. https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc115.htm. Onde: art. 1º (inciso LXXIX do art. 5º da Constituição)."
    },
    {
      "titulo": "Emenda Constitucional nº 85, de 20 de dezembro de 2023 (Rio Grande do Sul).",
      "resto": "Assembleia Legislativa do Rio Grande do Sul; publicada no DOAL nº 13.168, de 21 de dezembro de 2023. Texto: https://ww3.al.rs.gov.br/filerepository/repLegis/arquivos/EC%2089-85.pdf. Ficha no Sistema LEGIS: https://www.al.rs.gov.br/legis/M010/M0100018.asp?Hid_IdNorma=74962&Texto=&Origem=1. Onde: art. 1º (nova redação do parágrafo único do art. 235) e art. 2º (vigência na data da publicação); ficha (proposição PEC 298/2023)."
    },
    {
      "titulo": "Proposta de Emenda à Constituição nº 29, de 2023.",
      "resto": "Senado Federal. Página: https://www25.senado.leg.br/web/atividade/materias/-/materia/158095. Texto inicial: https://legis.senado.leg.br/sdleg-getter/dadosabertos/documento/a9230a40-d423-4a6c-9aee-6878d728ae06. Dados abertos: https://legis.senado.leg.br/dadosabertos/processo/8472168. Onde: art. 1º (inciso LXXX); autoria; \"Situação atual\"."
    },
    {
      "titulo": "Projeto de Lei nº 522/2022.",
      "resto": "Câmara dos Deputados. Página: https://www.camara.leg.br/propostas-legislativas/2317524. Texto inicial: https://www.camara.leg.br/proposicoesWeb/prop_mostrarintegra?codteor=2146384. Tramitação: https://dadosabertos.camara.leg.br/api/v2/proposicoes/2317524/tramitacoes. Onde: arts. 2º e 3º do projeto (art. 5º, II e XX a XXII, e arts. 13-A a 13-E da LGPD propostos); tramitação de 23/10/2024, 12/12/2024, 13/03/2026 e 16/03/2026."
    },
    {
      "titulo": "Projeto de Lei nº 6687/2025.",
      "resto": "Câmara dos Deputados. Página: https://www.camara.leg.br/propostas-legislativas/2599280. Texto inicial: https://www.camara.leg.br/proposicoesWeb/prop_mostrarintegra?codteor=3071952. Onde: ementa; arts. 13-A a 13-C e inciso XXV do art. 55-J propostos; tramitação de 13/03/2026."
    },
    {
      "titulo": "Projeto de Lei nº 2174/2023.",
      "resto": "Câmara dos Deputados. Página: https://www.camara.leg.br/propostas-legislativas/2358605. Texto inicial: https://www.camara.leg.br/proposicoesWeb/prop_mostrarintegra?codteor=2264479. Onde: art. 2º; situação."
    },
    {
      "titulo": "Projeto de Lei nº 4, de 2025 (atualização do Código Civil).",
      "resto": "Senado Federal. Página: https://www25.senado.leg.br/web/atividade/materias/-/materia/166998. Texto inicial: https://legis.senado.leg.br/sdleg-getter/documento/download/90974bb3-27e0-46af-976a-99a7ebe3584d. Dados abertos: https://legis.senado.leg.br/dadosabertos/processo/8786015. Onde: Livro VI, Do Direito Civil Digital: artigo sobre neurodireitos (p. 205 do PDF); art. 5º do projeto, inciso VIII do art. 2º da LGPD (p. 229); informe de 11/06/2026 (prazo da comissão até 22/12/2026); \"Situação atual\"."
    },
    {
      "titulo": "Projeto de Lei nº 1229/2021.",
      "resto": "Câmara dos Deputados. https://www.camara.leg.br/propostas-legislativas/2276604. Onde: situação (\"Retirado pelo(a) Autor(a)\") e tramitação de 15/03/2022."
    },
    {
      "titulo": "Ley nº 21.383 (Chile).",
      "resto": "Biblioteca del Congreso Nacional de Chile, LeyChile; promulgada em 14 de outubro de 2021 e publicada em 25 de outubro de 2021. https://www.bcn.cl/leychile/navegar?idNorma=1166983 (texto lido pelo serviço https://www.leychile.cl/Consulta/obtxml?opt=7&idNorma=1166983). Onde: artigo único (novo parágrafo final do nº 1 do art. 19 da Constituição)."
    },
    {
      "titulo": "Sentença rol nº 105.065-2023.",
      "resto": "Corte Suprema do Chile, Terceira Sala, 9 de agosto de 2023. Sentença: https://www.pjud.cl/prensa-y-comunicaciones/getRulingNew/36102. Nota do Poder Judicial, 11 de agosto de 2023: https://www.pjud.cl/prensa-y-comunicaciones/noticias-del-poder-judicial/96951. Onde: parte resolutiva da sentença."
    },
    {
      "titulo": "HB24-1058, Protect Privacy of Biological Data.",
      "resto": "Colorado General Assembly, 2024. https://leg.colorado.gov/bills/hb24-1058. Onde: resumo e histórico (sanção em 17/04/2024)."
    },
    {
      "titulo": "2023-24 Legislative Bill Summary.",
      "resto": "California State Assembly, Committee on Privacy and Consumer Protection, dezembro de 2024. https://apcp.assembly.ca.gov/system/files/2024-12/2023-24-legislative-bill-summary.pdf. Onde: item \"SB-1223 (Becker)\" (Chapter 887, Statutes of 2024)."
    },
    {
      "titulo": "Governor signs Senator Becker's first-in-the-nation legislation on neurorights.",
      "resto": "Gabinete do senador estadual Josh Becker, Senado da Califórnia, 27 de setembro de 2024. https://sd13.senate.ca.gov/news/press-release/september-27-2024/governor-signs-senator-beckers-first-in-the-nation-legislation. Onde: parágrafo sobre a vigência (1º de janeiro de 2025)."
    },
    {
      "titulo": "Senate Bill 163 (2025).",
      "resto": "Montana Legislature, 69ª legislatura, texto autorizado do projeto aprovado. https://archive.legmt.gov/content/Sessions/69th/Contractor_index/CH0345.pdf. Código consolidado: https://mca.legmt.gov/bills/mca/title_0300/chapter_0230/part_0010/section_0020/0300-0230-0010-0020.html. Onde: título do ato; seção 2 (definição de \"neurotechnology data\"); MCA 30-23-102(10)."
    },
    {
      "titulo": "The Connecticut Data Privacy Act.",
      "resto": "Connecticut, Office of the Attorney General. https://portal.ct.gov/ag/sections/privacy/the-connecticut-data-privacy-act. Onde: pergunta \"What is the Difference Between Personal Data and Sensitive Data?\"."
    },
    {
      "titulo": "Action Taken by Governor Phil Scott on Legislation, May 18, 2026.",
      "resto": "Vermont, Office of the Governor. https://governor.vermont.gov/press-release/action-taken-governor-phil-scott-legislation-may-18-2026. Onde: lista de projetos sancionados em 18 de maio (H.814, com o título)."
    },
    {
      "titulo": "House Bill 380, 153rd General Assembly.",
      "resto": "Delaware General Assembly. Página: https://legis.delaware.gov/BillDetail/143105. Texto final: https://legis.delaware.gov/json/BillDetail/GenerateHtmlDocumentEngrossment?engrossmentId=37933&docTypeId=6. Onde: status (\"Signed 9/2/26\") e \"Effective Date: 1/1/27\"; definição de dados sensíveis (alínea e)."
    },
    {
      "titulo": "S. 2925, MIND Act of 2025 (Bill Status).",
      "resto": "U.S. Government Publishing Office, GovInfo. https://www.govinfo.gov/bulkdata/BILLSTATUS/119/s/BILLSTATUS-119s2925.xml. Onde: data de apresentação (2025-09-29) e última ação (envio ao Committee on Commerce, Science, and Transportation); registro atualizado em 2026-09-08."
    },
    {
      "titulo": "Recommendation of the Council on Responsible Innovation in Neurotechnology (OECD/LEGAL/0457).",
      "resto": "OCDE, adotada em 11 de dezembro de 2019. https://legalinstruments.oecd.org/en/instruments/OECD-LEGAL-0457 (PDF: https://legalinstruments.oecd.org/api/print?ids=658&lang=en). Onde: Background Information (adoção e nove princípios); definições (\"Cognitive liberty\", \"Personal brain data\"); princípio 7; nota sobre a natureza das recomendações (não vinculantes)."
    },
    {
      "titulo": "Towards new human rights in the age of neuroscience and neurotechnology.",
      "resto": "Ienca, M.; Andorno, R. Life Sciences, Society and Policy, v. 13, artigo 5, 26 de abril de 2017. https://lsspjournal.biomedcentral.com/articles/10.1186/s40504-017-0050-1. Onde: resumo (Abstract)."
    },
    {
      "titulo": "It's Time for Neuro-Rights.",
      "resto": "Yuste, R.; Genser, J.; Herrmann, S. Horizons, Center for International Relations and Sustainable Development (CIRSD). https://cirsd.org/horizon-article/its-time-for-neuro-rights/. Onde: trecho que enumera os neurodireitos propostos, de (1) a (5)."
    },
    {
      "titulo": "Mission.",
      "resto": "Neurorights Foundation. https://neurorightsfoundation.org/mission. Onde: texto da página (natureza da organização e criação por Rafael Yuste, Jared Genser e Jamie Daves)."
    },
    {
      "titulo": "Balanço da Agenda Regulatória 2025-2026: primeiro semestre de 2026.",
      "resto": "ANPD, agosto de 2026. https://www.gov.br/anpd/pt-br/assuntos/regulacao/agenda-regulatoria-1/agenda-regulatoria-2025-2026/balanco-agenda-regulatoria-2025-2026-01-2026.pdf/@@display-file/file. Onde: Tabela 1 (itens da agenda; itens 4 e 12 sobre dados sensíveis)."
    },
    {
      "titulo": "Projeto de Lei nº 1221/2021.",
      "resto": "Câmara dos Deputados, dados abertos. https://dadosabertos.camara.leg.br/api/v2/proposicoes/2276561/tramitacoes. Onde: tramitação de 28/04/2021 (retirada pelo autor)."
    }
  ]
};
