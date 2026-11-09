# Como contribuir

Correções e sugestões são bem-vindas, de pesquisadores, profissionais de saúde e de educação, desenvolvedores e instituições.

1. Diga o registro (o endereço ou o id, como `neurobase.tea`), o que deve mudar e a fonte que sustenta a mudança.
2. A fonte precisa ser primária: lei ou norma no texto oficial, documento de órgão público, classificação oficial, diretriz clínica ou artigo revisado por pares (com o DOI).
3. Toda mudança passa pela mesma conferência dos registros, entra numa nova versão e aparece no histórico.

Para mudar um registro aqui, edite o arquivo em `bases/<base>/registros/`, suba o número da versão, acrescente a linha no `historico` e rode `node scripts/validar.mjs`.

## O que não entra

- Dado de paciente: prontuário, laudo, resultado de teste, relato clínico, foto ou vídeo.
- Itens, pranchas, estímulos ou respostas de testes psicológicos.
- Texto copiado de manual ou de artigo protegido por direito autoral.
- Indicação de clínica, de profissional ou de serviço.

## Regras de texto

Português do Brasil, frases curtas, sem travessão, sem "especialista", sem preço e sem promessa de resultado. O validador confere.
