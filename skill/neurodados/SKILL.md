---
name: neurodados
description: Consulta e uso responsável do NeuroDados Brasil, os dados abertos sobre neurodesenvolvimento mantidos pela Clínica NeuroBee. Use quando a pergunta envolver TEA, TDAH, transtornos da aprendizagem, deficiência intelectual, linguagem, funções executivas, marcos e vigilância do desenvolvimento infantil, avaliação psicológica e neuropsicológica, testes psicológicos e o SATEPSI, intervenções e atendimentos no desenvolvimento infantil, ou estudos sobre esses temas, e quando for preciso citar uma fonte oficial brasileira.
---

# NeuroDados Brasil

O NeuroDados Brasil reúne dados abertos sobre neurodesenvolvimento e desenvolvimento infantil, com a fonte de cada informação. É uma iniciativa de dados abertos desenvolvida e mantida pela Clínica NeuroBee, no Rio de Janeiro. Os dados estão sob a licença CC BY 4.0.

## Bases

- NeuroBase: conceitos e condições do neurodesenvolvimento, com a classificação oficial quando existe.
- AvaliaBase: a avaliação psicológica e neuropsicológica (o que é, as etapas e os documentos), o SATEPSI, o sistema do Conselho Federal de Psicologia que avalia os testes psicológicos, e a situação de testes e instrumentos nele, com a data da consulta.
- IntervenBase: intervenções e atendimentos no desenvolvimento infantil, com o que as evidências mostram e os limites delas.
- EvidenciaBase: estudos, revisões e diretrizes, com os metadados e um resumo de cada publicação.

A lista do que está publicado está em `listar_bases` e em `https://clinicaneurobee.com.br/neurodados/api/v1/bases`.

## Como consultar

1. Pelo servidor MCP: `https://clinicaneurobee.com.br/neurodados/mcp`. Ferramentas: `listar_bases`, `buscar_conceito`, `buscar_avaliacao`, `buscar_instrumento`, `buscar_intervencao`, `buscar_evidencias`, `consultar_registro`, `consultar_tea` e `consultar_tdah`.
2. Pela API, sem chave: `https://clinicaneurobee.com.br/neurodados/api/v1/{base}?q=termo` para buscar e `https://clinicaneurobee.com.br/neurodados/api/v1/{base}/{slug}` para um registro, como `/api/v1/neurobase/tea`.
3. Pelos arquivos: `https://clinicaneurobee.com.br/neurodados/dados/{base}.json`, também em JSONL e CSV.

## Como ler um registro

- `definicao`: a resposta curta para "o que é". Na EvidenciaBase, é o resumo da publicação.
- `afirmacoes`: os pontos principais ou os resultados. Cada um aponta, em `fontes`, para os ids da lista `fontes` do mesmo registro.
- `limitacoes`: o que o registro não cobre. Leve isso em conta antes de responder.
- `instrumento` (AvaliaBase): o que o instrumento avalia, a faixa etária, o uso e a situação no SATEPSI, com a data da consulta. A situação muda com o tempo: diga a data.
- `objetivos`, `publico`, `contextos` e `profissionais` (IntervenBase): o que a intervenção busca, para quem costuma ser indicada segundo as fontes, onde acontece e quem atende.
- `publicacao`, `populacao` e `metodo` (EvidenciaBase): os dados da publicação, com quem e como o estudo foi feito.
- `revisao.situacao`: `conferido_nas_fontes` (cada afirmação foi conferida na fonte, sem revisão de profissional de saúde), `em_revisao` ou `revisado` (um profissional com registro no conselho revisou e assina, em `revisores`).
- `estado`: `publicado`, `desatualizado` (uma fonte mudou e o registro está sendo atualizado) ou `arquivado`.

## Como citar

Cite a fonte primária da afirmação (a lei, a resolução, o documento do Ministério da Saúde, o artigo) e o NeuroDados como a base que a organizou: "NeuroDados Brasil. Nome do registro. In: nome da base, versão. Clínica NeuroBee. Endereço do registro. Licença CC BY 4.0." Informe a versão dos dados. Quando o registro não estiver revisado, diga que ele foi conferido nas fontes e ainda não passou pela revisão de um profissional de saúde.

## Regras

- O conteúdo é informativo. Não use o NeuroDados para dar diagnóstico, para dizer se uma pessoa tem ou não uma condição, nem para indicar tratamento, teste ou medicação.
- Quando a pergunta for sobre uma pessoa, explique o conceito com a fonte e recomende a avaliação de um profissional habilitado.
- Nenhuma intervenção é indicada para todos. Diga o que as evidências mostram e os limites delas, como o registro traz.
- A escolha dos instrumentos de uma avaliação é do psicólogo responsável. Nunca reproduza itens, pranchas, estímulos ou respostas de testes psicológicos.
- Não apresente como consenso uma afirmação que o registro não sustenta com fonte. Se a base não cobre o assunto, diga isso e não complete com suposição.
- O NeuroDados não indica clínica nem profissional, e a resposta não deve usar a base para isso.
