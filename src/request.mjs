// const undici = require('undici');

class Request {
  static request(...args) {
    return new this(...args);
  }

  static options(url, options) {
    return this.request(url, { method: 'OPTIONS', ...options });
  }

  static get(url, options) {
    return this.request(url, { method: 'GET', ...options });
  }

  static post(url, options) {
    return this.request(url, { method: 'POST', ...options });
  }

  static put(url, options) {
    return this.request(url, { method: 'PUT', ...options });
  }

  static delete(url, options) {
    return this.request(url, { method: 'DELETE', ...options });
  }

  // --------------------------------------------------------------------------
  /**
   * @param url {string}
   * @param [options] {RequestInit}
   * @param [options.signal] {AbortSignal} - for example `new AbortController()`
   * @param [options.dispatcher] {Dispatcher} - for example `undici.ProxyAgent`
   */
  constructor(url, options = {}) {
    this._parseBuffer = false;

    this.url = new URL(url);
    this.options = options;

    this.options.headers = this.options.headers || {};
  }

  method(method) {
    this.options.method = method;
    return this;
  }

  append(string) {
    const pathname = this.url.pathname.slice(1);

    this.url.pathname = `${pathname}${string}`;

    return this;
  }

  query(object) {
    this.url.search = new URLSearchParams(object);

    return this;
  }

  headers(object) {
    Object.assign(this.options.headers || {}, object);

    return this;
  }

  set(key, value) {
    this.options.headers[key] = value;

    return this;
  }

  body(data) {
    if (typeof data === 'object' && data !== null) {
      this.set('content-type', 'application/json');
      this.options.body = JSON.stringify(data);
    } else {
      this.options.body = data;
    }

    return this;
  }

  buffer(isParseBuffer) {
    this._parseBuffer = Boolean(isParseBuffer);

    return this;
  }

  // --------------------------------------------------------------------------
  // proxy(options) {
  //   const { ProxyAgent } = require('undici');
  //   this.options.dispatcher = new ProxyAgent(options);
  //   return this;
  // }

  // --------------------------------------------------------------------------
  /**
   * @param response {Response}
   */
  async _parseBody(response) {
    const contentType = response.headers.get('content-type') || '';
    const [type] = contentType.split(';');

    switch (type) {
      case 'application/json':
      case 'application/json-patch+json':
      case 'application/vnd.api+json':
      case 'application/csp-report':
        response.data = await response.json();
        break;

      case 'text/plain':
      case 'text/xml':
      case 'application/xml':
        response.data = await response.text();
        break;

      case 'application/x-www-form-urlencoded':
        response.data = await response.formData();
        break;

      default:
        break;
    }

    if (!response.bodyUsed && this._parseBuffer) {
      response.data = Buffer.from(await response.arrayBuffer());
    }
  }

  // ------------------------------- thenable ---------------------------------
  async then(resolve, reject) {
    let response;

    try {
      response = await fetch(this.url, this.options);
    } catch (e) {
      reject(e);
    }

    try {
      await this._parseBody(response);
    } catch (e) {
      e.response = response;
      return reject(e);
    }

    return resolve(response);
  }

  catch(reject) {
    return this.then(v => v, reject);
  }

  finally(onFinally) {
    return new Promise(
      (resolve, reject) => this.then(resolve, reject).finally(onFinally),
    );
  }
}

export default Request;
