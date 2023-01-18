import assert from 'node:assert';
import Request from './request.mjs';

const VERSION = '2.0';

/**
 * @example
 */
class JsonRRC {
  constructor(url) {
    this._url = url;

    return new Proxy(this, {
      get(target, key, receiver) {
        if (Reflect.has(target, key)) {
          return Reflect.get(target, key, receiver);
        }
        return (...args) => target._call(key, ...args);
      },
    });
  }

  // TODO: websocket
  async _request(body) {
    const response = await Request.post(this._url).body(body);

    return response.data;
  }

  async _call(method, ...params) {
    const id = Math.random();

    const data = await this._request({ jsonrpc: VERSION, id, method, params });

    assert(typeof data === 'object', `response data not object, got "${typeof data}"`);
    assert(data.jsonrpc === VERSION, `response jsonrpc !== ${VERSION}`);
    assert(data.id === id, `response id !== request id "${id}"`);

    if (data.error) {
      assert(typeof data.error === 'object', `response error not object, got "${typeof data.error}"`);

      const error = new Error(data.error.message);
      error.code = data.error.code;
      throw error;
    }
    return data.result;
  }
}

export default JsonRRC;

