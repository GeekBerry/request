import { describe, before, after, it } from 'node:test';
import assert from 'node:assert';
import { JsonRRC } from '../dist/index.mjs';
import app from './server.mjs';

const port = 3331;
const url = `http://127.0.0.1:${port}`;

describe('net', () => {
  let jsonrpc;

  before(() => {
    jsonrpc = new JsonRRC(`${url}/jsonrpc`);
    app.listen(port);
  });

  it('add', async () => {
    const result = await jsonrpc.add(1, 2, 3, 4);
    assert.equal(result, 10);
  });

  it('div', async () => {
    const result = await jsonrpc.div(1, 0).catch(e => e);
    assert.equal(result instanceof Error, true);
    assert.equal(result.message, 'div zero error');
  });

  after(() => {
    app.close();
  });
});
