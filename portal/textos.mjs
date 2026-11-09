// Todos os textos fixos do portal do NeuroDados Brasil. É daqui que sai a lista
// para a aprovação literal (scripts/textos.mjs): texto mudou aqui, volta para
// a aprovação. {email}, {n}, {versao} e afins são preenchidos na montagem.

export const MARCA = {
  nome: 'NeuroDados Brasil',
  nomeCurto: 'NeuroDados',
  assinatura: 'Uma iniciativa de dados abertos desenvolvida e mantida pela Clínica NeuroBee.',
  lema: 'Dados abertos sobre neurodesenvolvimento, com a fonte de cada informação.',
};

export const AVISO = 'Conteúdo informativo. Não serve para diagnóstico e não substitui a avaliação de um profissional habilitado.';

export const PULAR = 'Pular para o conteúdo';
export const MENU_ROTULO = 'Menu do NeuroDados';

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
  resumo: 'Dados abertos sobre neurodesenvolvimento e desenvolvimento infantil, com a fonte de cada informação. Uma iniciativa de dados abertos desenvolvida e mantida pela Clínica NeuroBee, no Rio de Janeiro. Dados sob a licença CC BY 4.0.',
  bases: 'Bases',
  linhaBase: '{titulo}. {n} registros, versão {versao}. JSON: {json} · JSONL: {jsonl} · CSV: {csv}',
  registros: 'Registros da {nome}',
  consultar: 'Como consultar',
  itensConsultar: [
    ['API (JSON, sem chave)', '{api}'],
    ['OpenAPI', '{openapi}'],
    ['Servidor MCP', '{mcp}'],
    ['Skill', '{skill}'],
  ],
  regras: 'Regras',
  itensRegras: [
    ['Governança', '{governanca}'],
    ['Metodologia', '{metodologia}'],
    ['Licenças', '{licencas}'],
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
  ],
  privacidade: 'Política de privacidade',
  licenca: 'Dados sob a licença CC BY 4.0. Código sob a licença MIT.',
};

export const CATEGORIAS = {
  conceito: 'Conceitos',
  condicao_do_neurodesenvolvimento: 'Condições do neurodesenvolvimento',
  dominio_do_desenvolvimento: 'Domínios do desenvolvimento',
  marco_do_desenvolvimento: 'Marcos do desenvolvimento',
  termo_clinico: 'Termos clínicos',
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
  tituloPagina: '{nome} | NeuroBase · NeuroDados Brasil',
  migalha: ['NeuroDados', 'Bases', 'NeuroBase'],
  definicao: 'Definição',
  nomesAlternativos: 'Também chamado de',
  afirmacoes: 'Pontos principais',
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
  citacao: 'NeuroDados Brasil. {nome}. In: NeuroBase, versão {versaoBase}. Rio de Janeiro: Clínica NeuroBee, {ano}. Disponível em: {url}. Licença CC BY 4.0.',
  dados: 'Dados deste registro',
  dadosTexto: 'O mesmo registro em JSON, pela API: {api}',
  voltar: 'Voltar para a NeuroBase',
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
          'O NeuroDados reúne, em formato aberto, informações sobre neurodesenvolvimento: conceitos, condições, classificações oficiais e as fontes que sustentam cada afirmação.',
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
          'O NeuroDados Brasil é uma iniciativa de dados abertos sobre neurodesenvolvimento, desenvolvida e mantida pela Clínica NeuroBee, clínica de psicologia e avaliação neuropsicológica no Recreio dos Bandeirantes, no Rio de Janeiro.',
          'A clínica cuida da infraestrutura, da redação e da conferência dos registros. O NeuroDados tem regras próprias, publicadas na governança e na metodologia, e elas valem acima de qualquer interesse da clínica.',
        ],
      },
      {
        titulo: 'Conflito de interesse',
        paragrafos: [
          'A Clínica NeuroBee presta serviços de psicologia e de avaliação neuropsicológica. Por isso, nenhum registro indica, recomenda ou cita a clínica, os profissionais dela ou os preços dela.',
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
    tituloNeurobase: 'NeuroBase | Conceitos e condições do neurodesenvolvimento',
    descricaoNeurobase: 'Conceitos e condições do neurodesenvolvimento com definição simples, pontos principais ligados às fontes e classificação CID. Dados abertos, CC BY 4.0.',
    registros: 'Os registros',
    baixar: 'Baixar e consultar',
    downloads: [
      ['JSON', 'a base inteira, numa lista'],
      ['JSONL', 'um registro por linha'],
      ['CSV', 'uma linha por registro, com os campos principais'],
      ['Schema', 'o formato de cada registro, em JSON Schema'],
      ['API', 'a mesma base, registro a registro'],
    ],
    citar: 'Como citar',
    citacao: 'NeuroDados Brasil. NeuroBase: conceitos e condições do neurodesenvolvimento, versão {versao}. Rio de Janeiro: Clínica NeuroBee, {ano}. Disponível em: {url}. Licença CC BY 4.0.',
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
        ['GET /api/v1/neurobase', 'Os registros da NeuroBase, com os filtros q (busca), categoria, pagina e por_pagina (até 100).'],
        ['GET /api/v1/neurobase/{slug}', 'Um registro completo, como /api/v1/neurobase/tea.'],
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
  consultar_registro: 'Devolve um registro completo da NeuroBase, com as afirmações, as fontes, a classificação e a situação da revisão. Aceita o id (como neurobase.tea) ou o slug (como tea).',
  consultar_tea: 'Devolve o registro do Transtorno do Espectro Autista (TEA) na NeuroBase.',
  consultar_tdah: 'Devolve o registro do Transtorno do Déficit de Atenção com Hiperatividade (TDAH) na NeuroBase.',
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
  parametroLimite: 'Quantos registros devolver, de 1 a 20.',
  parametroId: 'O id (como neurobase.tea) ou o slug (como tea).',
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

export const INSTRUCOES_MCP = 'NeuroDados Brasil: dados abertos sobre neurodesenvolvimento, mantidos pela Clínica NeuroBee. Cite a fonte de cada afirmação e a versão dos dados. Diga se o registro foi só conferido nas fontes ou revisado por profissional. O conteúdo é informativo: não use para diagnóstico e recomende a avaliação de um profissional habilitado quando a pergunta for sobre uma pessoa.';
