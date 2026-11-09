# NeuroDados Brasil

Dados abertos sobre neurodesenvolvimento e desenvolvimento infantil, com a fonte de cada informação. Uma iniciativa de dados abertos desenvolvida e mantida pela Clínica NeuroBee em parceria com a Otimiza.pro.

- Portal: <https://clinicaneurobee.com.br/neurodados>
- API: <https://clinicaneurobee.com.br/neurodados/api/v1> (JSON, sem chave)
- Servidor MCP: <https://clinicaneurobee.com.br/neurodados/mcp>
- Documentação: <https://clinicaneurobee.com.br/neurodados/documentacao>
- As bases no Hugging Face: <https://huggingface.co/neurodados>
- Cada versão de cada base também fica no Zenodo, com DOI. O DOI está na página da base, no portal.

Conteúdo informativo. Não serve para diagnóstico e não substitui a avaliação de um profissional habilitado.

## Bases

| Base | O que tem | Arquivos |
|---|---|---|
| NeuroBase | Conceitos e condições do neurodesenvolvimento | `bases/neurobase/registros/*.json` |
| AvaliaBase | Avaliação psicológica e neuropsicológica | `bases/avaliabase/registros/*.json` |
| IntervenBase | Intervenções e atendimentos no desenvolvimento infantil | `bases/intervenbase/registros/*.json` |
| EvidenciaBase | Estudos e diretrizes sobre neurodesenvolvimento | `bases/evidenciabase/registros/*.json` |
| NeuroDireitos | Leis e normas federais sobre neurodesenvolvimento, deficiência, saúde mental e doenças | `bases/neurodireitos/registros/*.json` |

Cada registro traz a definição (na EvidenciaBase, o resumo da publicação), os pontos principais ligados às fontes, as limitações e a situação da revisão. O formato está em `schemas/` (JSON Schema).

## Como trabalhar neste repositório

Node 20 ou mais novo, sem dependências.

```sh
node scripts/validar.mjs              # schema, fontes, relações e regras de texto
node scripts/construir.mjs            # prévia em dist/site (com os rascunhos, sem medição)
node scripts/testar.mjs               # páginas, API, MCP, downloads e links, pelo próprio Worker
node scripts/servir.mjs               # prévia em http://127.0.0.1:4518/neurodados
node scripts/textos.mjs               # lista dos textos públicos para a aprovação
node scripts/construir.mjs --publicar # o que vai ao ar: valida e confere os textos aprovados
```

O portal, a API e o servidor MCP rodam num Cloudflare Worker (`worker/`, `wrangler.toml`) na rota `clinicaneurobee.com.br/neurodados*`.

## Licenças

- Dados: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt_BR) (`LICENSE-DADOS.md`). Uso comercial permitido, com a citação da fonte.
- Código: MIT (`LICENSE`).
- As marcas NeuroDados Brasil e NeuroBee não fazem parte das licenças.

## Como citar

NeuroDados Brasil, Clínica NeuroBee. Nome da base, versão. Endereço do registro ou da base. Licença CC BY 4.0.

## Contribuições

Veja `CONTRIBUTING.md` e a página <https://clinicaneurobee.com.br/neurodados/contribuicoes>.
