import Koaflow from 'koaflow';
import jsonrpc from './jsonrpc.mjs';

const app = new Koaflow();

app.router.all('/request',
  (ctx) => ({
    method: ctx.method,
    path: ctx.path,
    query: ctx.request.query,
    headers: ctx.request.headers,
    body: ctx.request.body,
  }),
);

app.router.all('/buffer',
  () => Buffer.from('buffer'),
);

app.router.all('/text',
  () => 'text',
);

app.router.post('/jsonrpc',
  ctx => ctx.request.body,
  jsonrpc,
);

export default app;
