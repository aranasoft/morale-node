var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    util = require('util'),
    morale = require('../index.js');

require('./assert.js');

vows.describe('Project API Tests').addBatch({
  "with valid credentials": {
    topic: morale("subdomain", "abcdefg"),
    "adding a project": {
      topic: function(moraleApi) {
        var project = {
          name: "Test Project #3",
        };

        if (nock) {
          var nockRequestData = {
            project: {
              name: project.name,
            },
          },
              nockResponseData = {
              id: 1,
              name: project.name,
              account_id: 1,
              updated_at: "2011-09-01T18:49:25Z",
              created_at: "2011-06-23T03:55:34Z"
              };
          nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
        }

        moraleApi.addProject(project, this.callback);
      },
      "should not return an error": assert.noAsyncError(),
      "should return the new project": function(res, err) {
        assert.isObject(res);
        assert.include(res, "name");
        assert.isString(res.name);
        assert.equal(res.name, "Test Project #3");
        assert.include(res, "account_id");
        assert.include(res, "id");
      },
    },
    "retriving a list of projects": {
      topic: function(moraleApi) {
        if (nock) {
          var nockResponseData = [{
            project: {
              id: 120,
              name: "Test Project #1",
              account_id: 1,
              updated_at: "2011-09-01T18:49:25Z",
              created_at: "2011-06-23T03:55:34Z"
            },
            project: {
              id: 121,
              name: "Test Project #2",
              account_id: 1,
              updated_at: "2011-10-01T16:29:29Z",
              created_at: "2011-06-25T03:25:32Z"
            }
          }];
          nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects').reply(200, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
        }

        moraleApi.getProjects(this.callback);
      },
      "should not return an error": assert.noAsyncError(),
      "should return a populated array": function(res, err) {
        assert.isArray(res);
        assert.isNotEmpty(res);
      },
      "should contain a project": function(res, err) {
        assert.isArray(res);
        assert.isNotEmpty(res);
        assert.include(res[0], "project");
        assert.isObject(res[0].project);
      },
    },
    "with a project that exists": {
      topic: 21200,
      "retriving a project": {
        topic: function(projectId, moraleApi) {
          if (nock) {
            var nockResponseData = {
              id: projectId,
              name: "Test Project #1",
              account_id: 1,
              updated_at: "2011-09-01T18:49:25Z",
              created_at: "2011-06-23T03:55:34Z"
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId).reply(200, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }

          moraleApi.getProject(projectId, this.callback);
        },
        "should not return an error": assert.noAsyncError(),
        "should return the requested project": function(res, err) {
          assert.isObject(res);
          assert.include(res, "name");
          assert.include(res, "account_id");
          assert.include(res, "id");
          assert.isNumber(res.id);
          assert.equal(res.id, this.context.topics[0]);
        },
      },
      "updating a project": {
        topic: function(projectId, moraleApi) {
          var project = {
            id: projectId,
            name: "Test Project #4",
          };

          if (nock) {
            var nockRequestData = {
              project: {
                name: project.name,
              },
            };
            var nockResponseData = {
              id: project.id,
              name: project.name,
              account_id: 1,
              updated_at: "2011-09-01T18:49:25Z",
              created_at: "2011-06-23T03:55:34Z"
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).put('/api/v1/projects/' + project.id, JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }

          moraleApi.updateProject(project, this.callback);
        },
        "should not return an error": assert.noAsyncError(),
        "should return the updated project": function(res, err) {
          assert.isObject(res);
          assert.include(res, "name");
          assert.isString(res.name);
          assert.equal(res.name, "Test Project #4");
          assert.include(res, "account_id");
          assert.include(res, "id");
          assert.isNumber(res.id);
          assert.equal(res.id, this.context.topics[0]);
        },
      },
      "deleting a project": {
        topic: function(projectId, moraleApi) {
          if (nock) {
            var nockResponseData = {
              id: projectId,
              name: "Sample Project That Was Deleted",
              account_id: 1,
              updated_at: "2011-09-01T18:49:25Z",
              created_at: "2011-06-23T03:55:34Z"
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).delete('/api/v1/projects/' + projectId).reply(200, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }

          moraleApi.deleteProject(projectId, this.callback);
        },
        "should not return an error": assert.noAsyncError(),
        "should return the updated project": function(res, err) {
          assert.isObject(res);
          assert.include(res, "name");
          assert.isString(res.name);
          assert.include(res, "account_id");
          assert.include(res, "id");
          assert.isNumber(res.id);
          assert.equal(res.id, this.context.topics[0]);
        },
      },
    },
    "with a project that does not exist": {
      topic: 41404,
      "retriving a project": {
        topic: function(projectId, moraleApi) {
          if (nock) {
            var nockResponseData = {
              error: "Project does not exist",
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId).reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }

          moraleApi.getProject(projectId, this.callback);
        },
        "should not return data": assert.noAsyncResult(),
        "should return an http 404 status code": assert.asyncStatusCode(404),
        "should return a Project Not Found error message": assert.asyncStatusMessage("Project does not exist"),
      },
      "updating a project": {
        topic: function(projectId, moraleApi) {
          var project = {
            id: projectId,
            name: "Test Project #4",
          };

          if (nock) {
            var nockRequestData = {
              project: {
                name: project.name,
              },
            };
            var nockResponseData = {
              error: "Project does not exist",
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).put('/api/v1/projects/' + project.id, JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }
          moraleApi.updateProject(project, this.callback);
        },
        "should not return data": assert.noAsyncResult(),
        "should return an http 404 status code": assert.asyncStatusCode(404),
        "should return a Project Not Found error message": assert.asyncStatusMessage("Project does not exist"),
      },
      "deleting a project": {
        topic: function(projectId, moraleApi) {
          if (nock) {
            var nockResponseData = {
              error: "Project does not exist",
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).delete('/api/v1/projects/' + projectId).reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }

          moraleApi.deleteProject(projectId, this.callback);
        },
        "should not return data": assert.noAsyncResult(),
        "should return an http 404 status code": assert.asyncStatusCode(404),
        "should return a Project Not Found error message": assert.asyncStatusMessage("Project does not exist"),
      },
    },
  },
}).addBatch({
  "with invalid credentials": {
    topic: morale('invalid-account', 'someApiKey'),
    "creating a project": {
      topic: function(moraleApi) {
        var project = {
          name: "Project Should Not Get Created",
        };

        if (nock) {
          var nockRequestData = {
            project: {
              name: project.name,
            },
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }

        moraleApi.addProject(project, this.callback);
      },
      "should not return data": assert.noAsyncResult(),
      "should return an http 401 status code": assert.asyncStatusCode(401),
      "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
    },
    "retriving a list of projects": {
      topic: function(moraleApi) {
        if (nock) {
          nock('https://invalid-account.teammorale.com').get('/api/v1/projects').reply(401, "", {
            'content-type': 'text/plain'
          });
        }

        moraleApi.getProjects(this.callback);
      },
      "should not return data": assert.noAsyncResult(),
      "should return an http 401 status code": assert.asyncStatusCode(401),
      "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
    },
    "with a valid projectId": {
      topic: 12345,
      "retriving a project": {
        topic: function(projectId, moraleApi) {
          if (nock) {
            nock('https://invalid-account.teammorale.com').get('/api/v1/projects/' + projectId).reply(401, "", {
              'content-type': 'text/plain'
            });
          }

          moraleApi.getProject(projectId, this.callback);
        },
        "should not return data": assert.noAsyncResult(),
        "should return an http 401 status code": assert.asyncStatusCode(401),
        "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
      },
      "updating a project": {
        topic: function(projectId, moraleApi) {
          var project = {
            id: projectId,
            name: "Project Should Not Get Created",
          };

          if (nock) {
            var nockRequestData = {
              project: {
                name: project.name,
              },
            };
            nock('https://invalid-account.teammorale.com').put('/api/v1/projects/' + project.id, JSON.stringify(nockRequestData)).reply(401, "", {
              'content-type': 'text/plain'
            });
          }

          moraleApi.updateProject(project, this.callback);
        },
        "should not return data": assert.noAsyncResult(),
        "should return an http 401 status code": assert.asyncStatusCode(401),
        "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
      },
      "deleting a project": {
        topic: function(projectId, moraleApi) {
          if (nock) {
            nock('https://invalid-account.teammorale.com').delete('/api/v1/projects/' + projectId).reply(401, "", {
              'content-type': 'text/plain'
            });
          }

          moraleApi.deleteProject(projectId, this.callback);
        },
        "should not return data": assert.noAsyncResult(),
        "should return an http 401 status code": assert.asyncStatusCode(401),
        "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
      },
    },
  },
}).export(module);
