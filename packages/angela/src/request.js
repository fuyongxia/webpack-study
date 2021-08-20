import formurlencoded from 'form-urlencoded';
import lodash from 'lodash';

/**
 * 返回请求对象
 * 
 * @param {any} [settings={}]
 * @returns 
 */
const request = (settings = {}) => {

    settings = lodash.merge({
        options: {
            credentials: 'include',
            headers: {
                'X-Requested-With': "XMLHttpRequest"
            }
        }
    }, settings);

    /** default request handler */
    function onRequest(req) {
        const urlencoded = data => {
            return formurlencoded(data, { ignorenull: true });
        };

        req.url = lodash.template(req.url)(req.body);
        if (req.method == 'GET') {
            req.body = urlencoded(req.body)
            return req;
        }

        let encodeFunc;
        if (req.headers['Content-Type'] == 'application/json') {
            encodeFunc = JSON.stringify;
        }

        if (req.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
            encodeFunc = urlencoded;
        }

        req.body = encodeFunc(req.body);
        return req;
    }

    /** default response handler */
    function onResponse(res) {
        if (res.status != 200) {
            return Promise.reject({ code: res.status, message: res.statusText });
        }

        return res.json()
            .then(result => {
                const { code, body, message } = result;
                if (code === '000000') {
                    return body;
                }
                return Promise.reject({ code, body, message });
            });
    }

    /** default error handler */
    function onError(error) {
        return Promise.reject(error);
    }

    function doFetch(url, options) {
        options = lodash.merge(settings.options, options);

        return fetch(url, options)
            .then(options.onResponse || settings.onResponse || onResponse)
            .catch(settings.onError || onError);
    }

    return {
        get(url, data = {}, options) {
            options = lodash.merge({
                url: url,
                method: 'GET',
                body: data
            }, options);

            return Promise.resolve(options)
                .then(options.onRequest || settings.onRequest || onRequest)
                .then(req => {
                    return doFetch([req.url, req.body].join('?'), lodash.omit(req, 'body'))
                });
        },

        post(url, data = {}, options) {
            options = lodash.merge({
                url: url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            }, options);

            return Promise.resolve(options)
                .then(options.onRequest || settings.onRequest || onRequest)
                .then(req => {
                    return doFetch(req.url, req)
                });
        },

        put(url, data = {}, options) {
            options = lodash.merge({
                url: url,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            }, options);

            return Promise.resolve(options)
                .then(options.onRequest || settings.onRequest || onRequest)
                .then(req => {
                    return doFetch(req.url, req)
                });
        },

        delete(url, data = {}, options) {
            options = lodash.merge({
                url: url,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/application/json'
                },
                body: data
            }, options);

            return Promise.resolve(options)
                .then(options.onRequest || settings.onRequest || onRequest)
                .then(req => {
                    return doFetch(req.url, req)
                });
        },

        fetch: fetch
    }
}

export default request;