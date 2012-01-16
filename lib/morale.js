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
  };

  return this;
}

module.exports = Morale;

Morale.prototype._makeRequest = function(reqPath, reqMethod, reqData, callback) {
  if (typeof reqData === 'function') {
    callback = reqData;
    reqData = null;
  }

  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  console.assert(reqPath.charAt(0) == '/', 'FAIL: UNEXPECTED URLPATH');

  var requestData = reqData == null ? null : JSON.stringify(reqData);
  var requestOptions = {
    host: this.options.subdomain + ".teammorale.com",
    path: reqPath,
    method: reqMethod,
    headers: {
      'Accept': '*/*',
      'Connection': 'close',
      'User-Agent': 'morale-node/' + VERSION,
      'Content-length': requestData == null ? 0 : requestData.length,
    },
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

  if (requestData != null) req.write(requestData);

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
  this._makeRequest('/api/v1/projects/' + projectId, 'GET', callback);
  return this;
};

Morale.prototype.addProject = function(project, callback) {
  console.assert(typeof project === 'object' && project.hasOwnProperty("name"), 'FAIL: INVALID PROJECT');
  console.assert(project.hasOwnProperty("name") && typeof project.name === 'string' && project.name != "", 'FAIL: PROJECT MUST CONTAIN A NAME');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  var projectRequestData = {
    project: {
      name: project.name,
    }
  };
  this._makeRequest('/api/v1/projects', 'POST', projectRequestData, callback);
  return this;
};

Morale.prototype.updateProject = function(project, callback) {
  console.assert(typeof project === 'object' && project.hasOwnProperty("name"), 'FAIL: INVALID PROJECT');
  console.assert(project.hasOwnProperty("id") && typeof project.id === 'number' && project.id > 0, 'FAIL: PROJECT MUST CONTAIN A VALID ID');
  console.assert(project.hasOwnProperty("name") && typeof project.name === 'string' && project.name != "", 'FAIL: PROJECT MUST CONTAIN A NAME');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  var projectRequestData = {
    project: {
      name: project.name,
    }
  };
  this._makeRequest('/api/v1/projects/' + project.id, 'PUT', projectRequestData, callback);
  return this;
};

Morale.prototype.deleteProject = function(projectId, callback) {
  console.assert(typeof projectId === 'number' && projectId > 0, 'FAIL: INVALID PROJECTID');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  this._makeRequest('/api/v1/projects/' + projectId, 'DELETE', callback);
  return this;
};
