import cookie from './cookie';
import request from './request';
import graphql from './graphql';
import socket from './socket';
import util from './util';

const app = {
    config(config) {
        Object.assign(app.config, config);
    },

    get cookie() {
        return cookie(app.config.cookie);
    },

    get request() {
        return request(app.config.request);
    },

    get graphql() {
        return graphql(app.config.graphql);
    },

    get storage() {
        return {
            get: (key) => {
                return localStorage.getItem(key) === 'undefined' ? undefined : JSON.parse(localStorage.getItem(key));
            },
            set: (key, value) => {
                return localStorage.setItem(key, JSON.stringify(value));
            },
            remove: (key) => {
                return localStorage.removeItem(key);
            },
            get length() {
                return localStorage.length;
            },
            clear: () => {
                return localStorage.clear();
            }
        }
    },

    get service() {
        const cfg = app.config.service;
        const builder = (def) => {
            const [all, type, url] = def.replace(/\n/g, '').match(/^(\w+)\s+(.*)$/);

            let service;
            if (/^(query|mutation)$/i.test(type)) {
                service = (data) => {
                    return app.graphql.request(all, data).then(data => data && data.body);
                }
                service.url = all;
            }

            if (/^(GET|POST|PUT|DELETE)$/i.test(type)) {
                service = (data, options) => {
                    return app.request[type.toLowerCase()](url, data, options);
                }
                service.url = url;
            }
            return service;
        }
        
        const results = {};
        Object.keys(cfg.items).map(key => {
            results[key] = builder(cfg.items[key]);
        })
        return results;
    },

    socket: (url, protocols, options) => {
        return socket(url, protocols, options || app.config.socket);
    },
    

    error: handler => {
        window.addEventListener('error', handler)
        window.addEventListener("unhandledrejection", (event) => handler(event.reason));
    },

    util: util
}

export default (config) => {
    app.config(require('./config.default'));
    app.config(config);
    return app;
}