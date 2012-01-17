var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    morale = require('../index.js');

vows.describe('Project API Tests').addBatch({
  "with a valid credentials": {
    topic: morale("valid-account", "someApiKey"),
    "retriving a list of projects": {
      topic: function(moraleApi) {
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

        nock('https://valid-account.teammorale.com').get('/api/v1/projects').reply(200, JSON.stringify(nockResponseData), {
          'content-type': 'application/json'
        });
        moraleApi.getProjects(this.callback);
      },
      "should not return an error": function(res, err) {
        assert.isNull(err);
      },
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
    "retriving a project": {
      "with a project that exists": {
        topic: function(moraleApi) {
          var projectId = 41200;
          var nockResponseData = {
            id: projectId,
            name: "Test Project #1",
            account_id: 1,
            updated_at: "2011-09-01T18:49:25Z",
            created_at: "2011-06-23T03:55:34Z"
          };

          nock('https://valid-account.teammorale.com').get('/api/v1/projects/' + projectId).reply(200, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
          moraleApi.getProject(projectId, this.callback);
        },
        "should not return an error": function(res, err) {
          assert.isNull(err);
        },
        "should return the requested project": function(res, err) {
          assert.isObject(res);
          assert.include(res, "name");
          assert.include(res, "account_id");
          assert.include(res, "id");
          assert.isNumber(res.id);
          assert.equal(res.id, 41200);
        },
      },
      "with a project that does not exist": {
        topic: function(moraleApi) {
          var projectId = 41404;
          var nockResponseData = {
            error: "Project does not exist",
          };

          nock('https://valid-account.teammorale.com').get('/api/v1/projects/' + projectId).reply(404, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
          moraleApi.getProject(projectId, this.callback);
        },
        "should not return data": function(res, err) {
          assert.isNull(res);
        },
        "should return an error": function(res, err) {
          assert.isObject(err);
        },
        "should return an http 404 status code": function(res, err) {
          assert.isObject(err);
          assert.include(err, "statusCode");
          assert.isNumber(err.statusCode);
          assert.equal(err.statusCode, 404);
        },
        "should return a Project Not Found error message": function(res, err) {
          assert.isObject(err);
          assert.include(err, "message");
          assert.isString(err.message);
          assert.equal(err.message, "Project does not exist");
        },
      },
    },
    "adding a project": {
      topic: function(moraleApi) {
        var project = {
          name: "Test Project #3",
        };
        var nockRequestData = {
          project: {
            name: project.name,
          },
        };
        var nockResponseData = {
          id: 42200,
          name: project.name,
          account_id: 1,
          updated_at: "2011-09-01T18:49:25Z",
          created_at: "2011-06-23T03:55:34Z"
        };

        nock('https://valid-account.teammorale.com').post('/api/v1/projects', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
          'content-type': 'application/json'
        });
        moraleApi.addProject(project, this.callback);
      },
      "should not return an error": function(res, err) {
        assert.isNull(err);
      },
      "should return the new project": function(res, err) {
        assert.isObject(res);
        assert.include(res, "name");
        assert.isString(res.name);
        assert.equal(res.name, "Test Project #3");
        assert.include(res, "account_id");
        assert.include(res, "id");
      },
    },
    "updating a project": {
      "with a project that exists": {
        topic: function(moraleApi) {
          var project = {
            id: 43200,
            name: "Test Project #4",
          };
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

          nock('https://valid-account.teammorale.com').put('/api/v1/projects/' + project.id, JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
          moraleApi.updateProject(project, this.callback);
        },
        "should not return an error": function(res, err) {
          assert.isNull(err);
        },
        "should return the updated project": function(res, err) {
          assert.isObject(res);
          assert.include(res, "name");
          assert.isString(res.name);
          assert.equal(res.name, "Test Project #4");
          assert.include(res, "account_id");
          assert.include(res, "id");
          assert.isNumber(res.id);
          assert.equal(res.id, 43200);
        },
      },
      "with a project that does not exist": {
        topic: function(moraleApi) {
          var project = {
            id: 43404,
            name: "Test Project #4",
          };
          var nockRequestData = {
            project: {
              name: project.name,
            },
          };
          var nockResponseData = {
            error: "Project does not exist",
          };

          nock('https://valid-account.teammorale.com').put('/api/v1/projects/' + project.id, JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
          moraleApi.updateProject(project, this.callback);
        },
        "should not return data": function(res, err) {
          assert.isNull(res);
        },
        "should return an error": function(res, err) {
          assert.isObject(err);
        },
        "should return an http 404 status code": function(res, err) {
          assert.isObject(err);
          assert.include(err, "statusCode");
          assert.isNumber(err.statusCode);
          assert.equal(err.statusCode, 404);
        },
        "should return a Project Not Found error message": function(res, err) {
          assert.isObject(err);
          assert.include(err, "message");
          assert.isString(err.message);
          assert.equal(err.message, "Project does not exist");
        },
      },
    },
    "deleting a project": {
      "with a project that exists": {
        topic: function(moraleApi) {
          var projectId = 44200;

          var nockResponseData = {
            id: projectId,
            name: "Sample Project That Was Deleted",
            account_id: 1,
            updated_at: "2011-09-01T18:49:25Z",
            created_at: "2011-06-23T03:55:34Z"
          };

          nock('https://valid-account.teammorale.com').delete('/api/v1/projects/' + projectId).reply(200, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
          moraleApi.deleteProject(projectId, this.callback);
        },
        "should not return an error": function(res, err) {
          assert.isNull(err);
        },
        "should return the updated project": function(res, err) {
          assert.isObject(res);
          assert.include(res, "name");
          assert.isString(res.name);
          assert.equal(res.name, "Sample Project That Was Deleted");
          assert.include(res, "account_id");
          assert.include(res, "id");
          assert.isNumber(res.id);
          assert.equal(res.id, 44200);
        },
      },
      "with a project that does not exist": {
        topic: function(moraleApi) {
          var projectId = 44404;

          var nockResponseData = {
            error: "Project does not exist",
          };

          nock('https://valid-account.teammorale.com').delete('/api/v1/projects/' + projectId).reply(404, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
          moraleApi.deleteProject(projectId, this.callback);
        },
        "should not return data": function(res, err) {
          assert.isNull(res);
        },
        "should return an error": function(res, err) {
          assert.isObject(err);
        },
        "should return an http 404 status code": function(res, err) {
          assert.isObject(err);
          assert.include(err, "statusCode");
          assert.isNumber(err.statusCode);
          assert.equal(err.statusCode, 404);
        },
        "should return a Project Not Found error message": function(res, err) {
          assert.isObject(err);
          assert.include(err, "message");
          assert.isString(err.message);
          assert.equal(err.message, "Project does not exist");
        },
      },
    },
  },
  "with an invalid credentials": {
    topic: morale('invalid-account', 'someApiKey'),
    "retriving a list of projects": {
      topic: function(moraleApi) {
        nock('https://invalid-account.teammorale.com').get('/api/v1/projects').reply(401, "", {
          'content-type': 'text/plain'
        });
        moraleApi.getProjects(this.callback);
      },
      "should not return data": function(res, err) {
        assert.isNull(res);
      },
      "should return an error": function(res, err) {
        assert.isObject(err);
      },
      "should return an http 401 status code": function(res, err) {
        assert.isObject(err);
        assert.include(err, "statusCode");
        assert.isNumber(err.statusCode);
        assert.equal(err.statusCode, 401);
      },
      "should return an http 401 error message": function(res, err) {
        assert.isObject(err);
        assert.include(err, "message");
        assert.isString(err.message);
        assert.equal(err.message, "Unauthorized");
      },
    },
    "retriving a project": {
      topic: function(moraleApi) {
        var projectId = 51401;
        nock('https://invalid-account.teammorale.com').get('/api/v1/projects/' + projectId).reply(401, "", {
          'content-type': 'text/plain'
        });
        moraleApi.getProject(projectId, this.callback);
      },
      "should not return data": function(res, err) {
        assert.isNull(res);
      },
      "should return an error": function(res, err) {
        assert.isObject(err);
      },
      "should return an http 401 status code": function(res, err) {
        assert.isObject(err);
        assert.include(err, "statusCode");
        assert.isNumber(err.statusCode);
        assert.equal(err.statusCode, 401);
      },
      "should return an http 401 error message": function(res, err) {
        assert.isObject(err);
        assert.include(err, "message");
        assert.isString(err.message);
        assert.equal(err.message, "Unauthorized");
      },
    },
    "creating a project": {
      topic: function(moraleApi) {
        var project = {
          name: "Project Should Not Get Created",
        };
        var nockRequestData = {
          project: {
            name: project.name,
          },
        };
        nock('https://invalid-account.teammorale.com').post('/api/v1/projects', JSON.stringify(nockRequestData)).reply(401, "", {
          'content-type': 'text/plain'
        });
        moraleApi.addProject(project, this.callback);
      },
      "should not return data": function(res, err) {
        assert.isNull(res);
      },
      "should return an error": function(res, err) {
        assert.isObject(err);
      },
      "should return an http 401 status code": function(res, err) {
        assert.isObject(err);
        assert.include(err, "statusCode");
        assert.isNumber(err.statusCode);
        assert.equal(err.statusCode, 401);
      },
      "should return an http 401 error message": function(res, err) {
        assert.isObject(err);
        assert.include(err, "message");
        assert.isString(err.message);
        assert.equal(err.message, "Unauthorized");
      },
    },
    "updating a project": {
      topic: function(moraleApi) {
        var project = {
          id: 53401,
          name: "Project Should Not Get Created",
        };
        var nockRequestData = {
          project: {
            name: project.name,
          },
        };
        nock('https://invalid-account.teammorale.com').put('/api/v1/projects/' + project.id, JSON.stringify(nockRequestData)).reply(401, "", {
          'content-type': 'text/plain'
        });
        moraleApi.updateProject(project, this.callback);
      },
      "should not return data": function(res, err) {
        assert.isNull(res);
      },
      "should return an error": function(res, err) {
        assert.isObject(err);
      },
      "should return an http 401 status code": function(res, err) {
        assert.isObject(err);
        assert.include(err, "statusCode");
        assert.isNumber(err.statusCode);
        assert.equal(err.statusCode, 401);
      },
      "should return an http 401 error message": function(res, err) {
        assert.isObject(err);
        assert.include(err, "message");
        assert.isString(err.message);
        assert.equal(err.message, "Unauthorized");
      },
    },
    "deleting a project": {
      topic: function(moraleApi) {
        var projectId = 54401;
        nock('https://invalid-account.teammorale.com').delete('/api/v1/projects/' + projectId).reply(401, "", {
          'content-type': 'text/plain'
        });
        moraleApi.deleteProject(projectId, this.callback);
      },
      "should not return data": function(res, err) {
        assert.isNull(res);
      },
      "should return an error": function(res, err) {
        assert.isObject(err);
      },
      "should return an http 401 status code": function(res, err) {
        assert.isObject(err);
        assert.include(err, "statusCode");
        assert.isNumber(err.statusCode);
        assert.equal(err.statusCode, 401);
      },
      "should return an http 401 error message": function(res, err) {
        assert.isObject(err);
        assert.include(err, "message");
        assert.isString(err.message);
        assert.equal(err.message, "Unauthorized");
      },
    },
  },
}).export(module);
