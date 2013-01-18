var EventEmitter = require('events').EventEmitter,
  http = require('http'),
  https = require('https'),
  util = require('util'),
  underscore = require('underscore'),
  pkg = require('../package.json');
var VERSION = pkg.version;

function Morale(subdomain, key) {
  if (!(this instanceof Morale)) {
    return new Morale(subdomain, key);
  }

  console.assert(typeof subdomain === 'string' && subdomain !== "", 'FAIL: INVALID SUBDOMAIN');
  console.assert(typeof key === 'string' && key !== "", 'FAIL: INVALID KEY');
  console.assert(/^[a-zA-Z0-9\-]+$/.test(subdomain), 'FAIL: INVALID SUBDOMAIN');

  this.options = {
    subdomain: subdomain,
    api_key: key
  };

  return this;
}

module.exports = Morale;

var makeRequest = function (reqOptions, reqData, callback) {
  if (typeof reqData === 'function') {
    callback = reqData;
    reqData = undefined;
  }

  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  console.assert(reqData === undefined || typeof reqData === 'object' || typeof reqData === 'string', 'FAIL: UNEXPECTED REQDATA');

  var requestData;
  var requestLength = 0;
  if (typeof reqData === 'object') {
    requestData = JSON.stringify(reqData);
    requestLength = requestData.length;
  }
  if (typeof reqData === 'string') {
    requestData = reqData;
    requestLength = requestData.length;
  }

  reqOptions.headers = {
    'Accept': '*/*',
    'Connection': 'close',
    'User-Agent': 'morale-node/' + VERSION,
    'Content-length': requestLength
  };

  var resCallback = function (res) {
    var responseData = '';
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      responseData += chunk;
    });

    res.on('end', function () {
      if (res.statusCode >= 200 && res.statusCode <= 202) {
        callback(null, JSON.parse(responseData));
      } else {
        var jsonData;
        if (typeof res.headers['content-type'] === 'string' && res.headers['content-type'] === 'application/json' && typeof responseData === 'string' && responseData !== "") { jsonData = JSON.parse(responseData); }
        var errMessage = (typeof jsonData === 'object' && jsonData.hasOwnProperty("error")) ? jsonData.error : http.STATUS_CODES[res.statusCode];

        callback({
          statusCode: res.statusCode,
          message: errMessage
        }, undefined);
      }
    });
  };

  var req = https.request(reqOptions, resCallback);

  req.on('error', function (err) {
    callback(err, null);
  });

  if (requestData !== undefined) { req.write(requestData); }

  req.end();
};

var makeAnonymousRequest = function (reqHost, reqPath, reqMethod, reqData, callback) {
  if (typeof reqData === 'function') {
    callback = reqData;
    reqData = undefined;
  }

  console.assert(typeof reqHost === 'string' && reqHost !== "", 'FAIL: INVALID HOST');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  console.assert(reqPath.charAt(0) === '/', 'FAIL: UNEXPECTED URLPATH');
  console.assert(reqData === undefined || typeof reqData === 'object' || typeof reqData === 'string', 'FAIL: UNEXPECTED REQDATA');

  var requestOptions = {
    host: reqHost.toLowerCase(),
    path: reqPath,
    method: reqMethod
  };

  makeRequest.call(this, requestOptions, reqData, callback);
};

var makeAuthenticatedRequest = function (reqPath, reqMethod, reqData, callback) {
  if (typeof reqData === 'function') {
    callback = reqData;
    reqData = undefined;
  }

  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  console.assert(reqPath.charAt(0) === '/', 'FAIL: UNEXPECTED URLPATH');
  console.assert(reqData === undefined || typeof reqData === 'object', 'FAIL: UNEXPECTED REQDATA');

  var requestOptions = {
    host: util.format("%s.teammorale.com", this.options.subdomain).toLowerCase(),
    path: reqPath,
    method: reqMethod,
    auth: this.options.subdomain + ":" + this.options.api_key
  };

  makeRequest.call(this, requestOptions, reqData, callback);
};

var buildTicketCommand = function (ticket) {
  console.assert(typeof ticket === 'object', 'FAIL: INVALID TICKET');

  var propertyWhiteList = ["title", "description", "due_date", "type", "assigned_to", "priority"];
  var ticketProperties = underscore.intersection(underscore.keys(ticket), propertyWhiteList);
  var addPropertyToCommandArray = function (commands, property) {
    return commands.concat(util.format("%s: %s", property, ticket[property]));
  };

  var commandList = underscore.reduce(ticketProperties, addPropertyToCommandArray, []);
  return commandList.join(" ");
};

module.exports.GetApiToken = function (subdomain, email, password, callback) {
  console.assert(typeof subdomain === 'string' && subdomain !== "", 'FAIL: INVALID SUBDOMAIN');
  console.assert(typeof email === 'string' && email !== "", 'FAIL: INVALID EMAIL');
  console.assert(typeof password === 'string' && password !== "", 'FAIL: INVALID PASSWORD');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');

  var authenticationBody = util.format("email=%s&password=%s", email, password);
  var requestHost = subdomain + ".teammorale.com";
  makeAnonymousRequest.call(this, requestHost, '/api/v1/in', 'POST', authenticationBody, callback);
  return this;
};

Morale.prototype.runTicketCommand = function (projectId, command, callback) {
  console.assert(typeof projectId === 'number' && projectId > 0, 'FAIL: INVALID PROJECTID');
  console.assert(typeof command === 'string' && command !== "", 'FAIL: INVALID COMMAND');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  var commandJson = {
    command: command
  };
  makeAuthenticatedRequest.call(this, '/api/v1/projects/' + projectId + '/tickets', 'POST', commandJson, callback);
  return this;
};

Morale.prototype.getProjects = function (callback) {
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  makeAuthenticatedRequest.call(this, '/api/v1/projects', 'GET', callback);
  return this;
};

Morale.prototype.getProject = function (projectId, callback) {
  console.assert(typeof projectId === 'number' && projectId > 0, 'FAIL: INVALID PROJECTID');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  makeAuthenticatedRequest.call(this, '/api/v1/projects/' + projectId, 'GET', callback);
  return this;
};

Morale.prototype.addProject = function (project, callback) {
  console.assert(typeof project === 'object' && project.hasOwnProperty("name"), 'FAIL: INVALID PROJECT');
  console.assert(project.hasOwnProperty("name") && typeof project.name === 'string' && project.name !== "", 'FAIL: PROJECT MUST CONTAIN A NAME');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  var projectRequestData = {
    project: {
      name: project.name
    }
  };
  makeAuthenticatedRequest.call(this, '/api/v1/projects', 'POST', projectRequestData, callback);
  return this;
};

Morale.prototype.updateProject = function (project, callback) {
  console.assert(typeof project === 'object' && project.hasOwnProperty("name"), 'FAIL: INVALID PROJECT');
  console.assert(project.hasOwnProperty("id") && typeof project.id === 'number' && project.id > 0, 'FAIL: PROJECT MUST CONTAIN A VALID ID');
  console.assert(project.hasOwnProperty("name") && typeof project.name === 'string' && project.name !== "", 'FAIL: PROJECT MUST CONTAIN A NAME');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  var projectRequestData = {
    project: {
      name: project.name
    }
  };
  makeAuthenticatedRequest.call(this, '/api/v1/projects/' + project.id, 'PUT', projectRequestData, callback);
  return this;
};

Morale.prototype.deleteProject = function (projectId, callback) {
  console.assert(typeof projectId === 'number' && projectId > 0, 'FAIL: INVALID PROJECTID');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  makeAuthenticatedRequest.call(this, '/api/v1/projects/' + projectId, 'DELETE', callback);
  return this;
};

Morale.prototype.getTickets = function (projectId, callback) {
  console.assert(typeof projectId === 'number' && projectId > 0, 'FAIL: INVALID PROJECTID');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  makeAuthenticatedRequest.call(this, '/api/v1/projects/' + projectId + '/tickets', 'GET', callback);
  return this;
};

Morale.prototype.getTicket = function (projectId, ticketIdentifier, callback) {
  console.assert(typeof projectId === 'number' && projectId > 0, 'FAIL: INVALID PROJECTID');
  console.assert(typeof ticketIdentifier === 'number' && ticketIdentifier > 0, 'FAIL: INVALID TICKETID');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  makeAuthenticatedRequest.call(this, '/api/v1/projects/' + projectId + '/tickets/' + ticketIdentifier, 'GET', callback);
  return this;
};

Morale.prototype.addTicket = function (ticket, callback) {
  console.assert(typeof ticket === 'object', 'FAIL: INVALID TICKET');
  console.assert(!ticket.hasOwnProperty("identifier"), 'FAIL: NEW TICKETS MUST NOT CONTAIN AN IDENTIFIER');
  console.assert(ticket.hasOwnProperty("title") && typeof ticket.title === 'string' && ticket.title !== "", 'FAIL: TICKET MUST CONTAIN A TITLE');
  console.assert(ticket.hasOwnProperty("project_id") && typeof ticket.project_id === 'number' && ticket.project_id > 0, 'FAIL: TICKET MUST CONTAIN A VALID PROJECT_ID');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');

  return this.runTicketCommand(ticket.project_id, buildTicketCommand.call(this, ticket), callback);
};

Morale.prototype.updateTicket = function (ticket, callback) {
  console.assert(typeof ticket === 'object', 'FAIL: INVALID TICKET');
  console.assert(ticket.hasOwnProperty("identifier") && typeof ticket.identifier === 'number' && ticket.identifier > 0, 'FAIL: TICKET MUST CONTAIN A VALID IDENTIFIER');
  console.assert(ticket.hasOwnProperty("project_id") && typeof ticket.project_id === 'number' && ticket.project_id > 0, 'FAIL: TICKET MUST CONTAIN A VALID PROJECT_ID');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');

  var command = util.format("#%d: %s", ticket.identifier, buildTicketCommand.call(this, ticket));
  return this.runTicketCommand(ticket.project_id, command, callback);
};

Morale.prototype.deleteTicket = function (projectId, ticketIdentifier, callback) {
  console.assert(typeof projectId === 'number' && projectId > 0, 'FAIL: INVALID PROJECTID');
  console.assert(typeof ticketIdentifier === 'number' && ticketIdentifier > 0, 'FAIL: INVALID TICKETID');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  return this.runTicketCommand(projectId, util.format("d #%d:", ticketIdentifier), callback);
};

Morale.prototype.archiveTicket = function (projectId, ticketIdentifier, callback) {
  console.assert(typeof projectId === 'number' && projectId > 0, 'FAIL: INVALID PROJECTID');
  console.assert(typeof ticketIdentifier === 'number' && ticketIdentifier > 0, 'FAIL: INVALID TICKETID');
  console.assert(typeof callback === 'function', 'FAIL: INVALID CALLBACK');
  return this.runTicketCommand(projectId, util.format("a #%d:", ticketIdentifier), callback);
};
