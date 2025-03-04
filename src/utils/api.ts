import storage from './storage';
import '../../types';

/**
 * Handles response according to content type
 * @param {object} response
 * @returns {promise}
 */
export function handleResponseType(response: Response): Promise<[boolean, Blob | string]> | Promise<void> {
  if (response.headers) {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/pdf')) {
      return Promise.all([response.ok, response.blob()]);
    }
    if (contentType && contentType.includes('application/json')) {
      return Promise.all([response.ok, response.json()]);
    }
    // it includes all text types
    if (contentType && contentType.includes('text/')) {
      return Promise.all([response.ok, response.text()]);
    }

    // unfortunatelly on download files there is no header available
    if (response.url && response.url.endsWith('.tgz') === true) {
      return Promise.all([response.ok, response.blob()]);
    }
  }

  return Promise.resolve();
}

class API {
  public request<T>(url: string, method = 'GET', options: RequestInit = { headers: {} }): Promise<T> {
    if (!window.VERDACCIO_API_URL) {
      throw new Error('VERDACCIO_API_URL is not defined!');
    }

    const token = storage.getItem('token');
    if (token && options.headers && typeof options.headers['Authorization'] === 'undefined') {
      options.headers = Object.assign({}, options.headers, {
        ['Authorization']: `Bearer ${token}`,
      });
    }

    if (!['http://', 'https://', '//'].some(prefix => url.startsWith(prefix))) {
      url = window.VERDACCIO_API_URL + url;
    }

    return new Promise((resolve, reject) => {
      fetch(url, {
        method,
        credentials: 'same-origin',
        ...options,
      })
        // @ts-ignore
        .then(handleResponseType)
        .then(response => {
          if (response[0]) {
            resolve(response[1]);
          } else {
            reject(new Error('something went wrong'));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default new API();
