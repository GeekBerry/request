import JsonRPCFlow from 'koaflow/lib/flow/JsonRPCFlow.js';

const jsonrpc = new JsonRPCFlow();

jsonrpc.method('add',
  function (params) {
    return params.reduce((x, y) => x + y);
  },
);

jsonrpc.method('div',
  ([x, y]) => {
    if (y === 0) {
      throw new Error('div zero error');
    }
    return x / y;
  },
);

export default jsonrpc;
