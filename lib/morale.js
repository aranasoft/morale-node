var EventEmitter = require('events').EventEmitter,
    http = require('http'),
    https = require('https'),
    VERSION = '0.0.1';

function Morale(subdomain, key) {
  if (!(this instanceof Morale)) {
    return new Morale(subdomain, key);
  };

  console.assert(typeof subdomain === 'string' && subdomain != "", 'FAIL: INVALID SUBDOMAIN');
  console.assert(typeof key === 'string' && key != "", 'FAIL: INVALID SUBDOMAIN');
  console.assert(/^[a-zA-Z0-9\-]+$/.test(subdomain), 'FAIL: INVALID SUBDOMAIN');

  this.options = {
    subdomain: subdomain,
    api_key: key,
    headers: {
      'Accept': '*/*',
      'Connection': 'close',
      'User-Agent': 'morale-node/' + VERSION
    }
  };

  return this;
}

module.exports = Morale;

Morale.prototype._makeRequest = function(urlPath, type, reqData, callback) {
  if (typeof reqData === 'function') {
    callback = reqData;
    reqData = null;
  }

  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  console.assert(urlPath.charAt(0) == '/', 'FAIL: UNEXPECTED URLPATH');

  var requestOptions = {
    host: this.options.subdomain + ".teammorale.com",
    path: urlPath,
    type: type,
    headers: this.options.headers,
    auth: this.options.subdomain + ":" + this.options.api_key
  };

  var resCallback = function(res) {
    res.setEncoding('utf8');

    if (res.statusCode != 200) {
      callback(undefined, {
        statusCode: res.statusCode,
        message: http.STATUS_CODES[res.statusCode]
      });
      return;
    }

    res.on('data', function(chunk) {
      callback(JSON.parse(chunk), null);
    });
  };

  var req = https.request(requestOptions, resCallback);
  req.on('error', function(err) {
    callback(null, e);
  });
  req.end();
};

Morale.prototype.getProjects = function(callback) {
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  this._makeRequest('/api/v1/projects', 'GET', callback);
  return this;
};

Morale.prototype.getProject = function(projectId, callback) {
  console.assert(typeof projectId === 'number' && projectId > 0, 'FAIL: INVALID PROJECTID');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  this._makeRequest('/api/v1/projects/'+projectId, 'GET', callback);
  return this;
};
