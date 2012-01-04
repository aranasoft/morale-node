var EventEmitter = require('events').EventEmitter,
VERSION = '0.0.1',
https = require('https');

function Morale(options) {
    var that;

    var defaults = {
        subdomain: null,
        api_key: null,
        headers: {
            'Accept': '*/*',
            'Connection': 'close',
            'User-Agent': 'morale-node/' + VERSION
        },
    };

    function getProjects(callback) {
        console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
        return makeRequest('/api/v1/projects', 'GET', callback);
    }

    function consolidate_options(defaults, options) {
        defaults = defaults || {};
        if (options && typeof options === 'object') {
            var keys = Object.keys(options);
            for (var i = 0, len = keys.length; i < len; i++) {
                var k = keys[i];
                if (options[k] !== undefined) defaults[k] = options[k];
            }
        }
        return defaults;
    }

    function makeRequest(urlPath, type, params, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = null;
        }

        console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
        console.assert(urlPath.charAt(0) == '/', 'FAIL: UNEXPECTED URLPATH');

        var requestOptions = {
            host: options.subdomain + ".teammorale.com",
            port: 443,
            path: urlPath,
            type: type,
            auth: options.subdomain + ":" + options.api_key
        };

        var resCallback = function(res) {
            res.setEncoding('utf8');
            res.on('data',
            function(chunk) {
                var requestData = JSON.parse(chunk);
                callback(requestData);
            });
        }
        var req = https.request(requestOptions, resCallback);

        req.on('error',
        function(e) {
            console.log('problem with request: ' + e.message);
        });

        req.end();
    }

    options = consolidate_options(defaults, options);

    that = {
        getProjects: getProjects
    };

    that.__proto__ = EventEmitter.prototype;

    return that;
}

module.exports = Morale;
