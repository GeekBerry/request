import { describe, before, after, it } from 'node:test';
import assert from 'node:assert';
import { Request } from '../dist/index.mjs';
import app from './server.mjs';

const port = 3330;
const url = `http://127.0.0.1:${port}`;

describe('new', () => {
  const request = new Request(url);

  assert.equal(request.url instanceof URL, true);
  assert.deepEqual(request.options, { headers: {} });

  request.method('QUERY');
  assert.deepEqual(request.options, { method: 'QUERY', headers: {} });
});

describe('methods', () => {
  assert.deepEqual(Request.options(url).options, { method: 'OPTIONS', headers: {} });
  assert.deepEqual(Request.get(url).options, { method: 'GET', headers: {} });
  assert.deepEqual(Request.post(url).options, { method: 'POST', headers: {} });
  assert.deepEqual(Request.put(url).options, { method: 'PUT', headers: {} });
  assert.deepEqual(Request.delete(url).options, { method: 'DELETE', headers: {} });
});

describe('append', { only: true }, () => {
  let request;

  request = Request.get('http://localhost').append('/A');
  assert.equal(request.url.href, 'http://localhost/A');

  request = Request.get('http://localhost').append('A');
  assert.equal(request.url.href, 'http://localhost/A');

  request = Request.get('http://localhost/').append('/A');
  assert.equal(request.url.href, 'http://localhost/A');
});

describe('net', async () => {
  before(() => {
    app.listen(port);
  });

  it('GET /text', async () => {
    const response = await Request.get(`${url}/text`);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8');
    assert.equal(response.bodyUsed, true);
    assert.equal(response.data, 'text');
  });

  it('GET /buffer', async () => {
    const response = await Request.get(`${url}/buffer`);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/octet-stream');
    assert.equal(response.bodyUsed, false);
    assert.equal(response.data, undefined);
  });

  it('GET /buffer .buffer(true)}', async () => {
    const response = await Request.get(`${url}/buffer`).buffer(true);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/octet-stream');
    assert.equal(response.bodyUsed, true);
    assert.equal(Buffer.compare(response.data, Buffer.from('buffer')), 0);
  });

  it('POST /request', async () => {
    const response = await Request.post(url)
      .append('/request')
      .query({ s: 'a', n: 100, a: [1, 2] })
      .headers({ h: 'h' })
      .body({ n: null });

    // console.log(response.url);
    assert.equal(response.status, 200);
    // console.log(response.statusText);
    // console.log(response.headers);
    assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
    assert.equal(response.bodyUsed, true);
    // console.log(response.body);

    // console.log(response.data);
    assert.equal(response.data.method, 'POST');
    assert.equal(response.data.path, '/request');
    // console.log(response.data.headers)
    assert.equal(response.data.headers['content-type'], 'application/json');
    assert.deepEqual(response.data.query, { s: 'a', n: '100', a: '1,2' });
    assert.deepEqual(response.data.body, { n: null });
  });

  it('PUT /not-exist', async () => {
    const response = await Request.put(`${url}/not-exist`);

    assert.equal(response.status, 404);
  });

  after(() => {
    app.close();
  });
});

