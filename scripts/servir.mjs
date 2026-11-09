// Prévia local do NeuroDados, pelo próprio Worker: node scripts/servir.mjs [porta]
// e abrir http://127.0.0.1:4518/neurodados. Rode antes node scripts/construir.mjs.

import { createServer } from 'node:http';
import { ambienteLocal, origemFalsa, carregarWorker } from './lib/ambiente.mjs';

origemFalsa();
const worker = await carregarWorker();
const env = ambienteLocal();
const porta = Number(process.argv[2] || 4518);

createServer(async (req, res) => {
  const partes = [];
  for await (const p of req) partes.push(p);
  const corpo = partes.length ? Buffer.concat(partes) : undefined;
  const pedido = new Request(`https://clinicaneurobee.com.br${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : corpo,
  });
  const resposta = await worker.fetch(pedido, env);
  const cabecalhos = Object.fromEntries(resposta.headers);
  if (cabecalhos.location) cabecalhos.location = cabecalhos.location.replace('https://clinicaneurobee.com.br', `http://127.0.0.1:${porta}`);
  res.writeHead(resposta.status, cabecalhos);
  res.end(resposta.body ? Buffer.from(await resposta.arrayBuffer()) : undefined);
}).listen(porta, '127.0.0.1', () => console.log(`Prévia em http://127.0.0.1:${porta}/neurodados`));
