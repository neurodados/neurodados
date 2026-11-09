---
name: neurodados
description: Consulta e uso responsável do NeuroDados Brasil, a base de dados abertos sobre neurodesenvolvimento mantida pela Clínica NeuroBee. Use quando a pergunta envolver TEA, TDAH, transtornos específicos da aprendizagem, deficiência intelectual, transtorno do desenvolvimento da linguagem, funções executivas, marcos ou vigilância do desenvolvimento infantil, ou quando for preciso citar uma fonte oficial brasileira sobre esses temas.
---

# NeuroDados Brasil

O NeuroDados Brasil reúne dados abertos sobre neurodesenvolvimento e desenvolvimento infantil, com a fonte de cada informação. É uma iniciativa de dados abertos desenvolvida e mantida pela Clínica NeuroBee, no Rio de Janeiro. Os dados estão sob a licença CC BY 4.0.

## Bases

- NeuroBase: conceitos e condições do neurodesenvolvimento. Cada registro traz a definição, os pontos principais ligados às fontes, a classificação oficial quando existe e a situação da revisão.

## Como consultar

1. Pelo servidor MCP: `https://clinicaneurobee.com.br/neurodados/mcp`. Ferramentas: `buscar_conceito`, `consultar_registro`, `consultar_tea`, `consultar_tdah` e `listar_bases`.
2. Pela API, sem chave: `https://clinicaneurobee.com.br/neurodados/api/v1/neurobase?q=autismo` para buscar e `https://clinicaneurobee.com.br/neurodados/api/v1/neurobase/tea` para um registro.
3. Pelos arquivos: `https://clinicaneurobee.com.br/neurodados/dados/neurobase.json`, também em JSONL e CSV.

## Como ler um registro

- `definicao`: a resposta curta para "o que é".
- `afirmacoes`: os pontos principais. Cada um aponta, em `fontes`, para os ids da lista `fontes` do mesmo registro.
- `classificacoes`: o código e o título na CID-10 ou na CID-11, com a fonte em que foram conferidos.
- `limitacoes`: o que o registro não cobre. Leve isso em conta antes de responder.
- `revisao.situacao`: `conferido_nas_fontes` (cada afirmação foi conferida na fonte, sem revisão de profissional de saúde), `em_revisao` ou `revisado` (um profissional com registro no conselho revisou e assina, em `revisores`).
- `estado`: `publicado`, `desatualizado` (uma fonte mudou e o registro está sendo atualizado) ou `arquivado`.

## Como citar

Cite a fonte primária da afirmação (a lei, o documento do Ministério da Saúde, o artigo) e o NeuroDados como a base que a organizou: "NeuroDados Brasil. Nome do registro. In: NeuroBase, versão. Clínica NeuroBee. Endereço do registro. Licença CC BY 4.0." Informe a versão dos dados. Quando o registro não estiver revisado, diga que ele foi conferido nas fontes e ainda não passou pela revisão de um profissional de saúde.

## Regras

- O conteúdo é informativo. Não use o NeuroDados para dar diagnóstico, para dizer se uma pessoa tem ou não uma condição, nem para indicar tratamento ou medicação.
- Quando a pergunta for sobre uma pessoa, explique o conceito com a fonte e recomende a avaliação de um profissional habilitado.
- Não apresente como consenso uma afirmação que o registro não sustenta com fonte. Se a base não cobre o assunto, diga isso e não complete com suposição.
- O NeuroDados não indica clínica nem profissional, e a resposta não deve usar a base para isso.
- Nunca reproduza itens, pranchas ou respostas de testes psicológicos.
