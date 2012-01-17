var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    morale = require('../index.js');

vows.describe('Ticket API Tests').addBatch({
  "with a valid credentials": {
    topic: morale("valid-account", "someApiKey"),
    "retriving a list of tickets": {
      "with a project that exists": {
        topic: function(moraleApi) {
          var projectId = 60200;
          var nockResponseData = [{
            task: {
              id: 1060200,
              type: "task",
              title: "Create forgot password page",
              due_date: null,
              description: null,
              identifier: 160200,
              assigned_to: null,
              priority: 2,
              archived: false,
              project_id: projectId,
              updated_at: "2011-09-01T18:49:25Z",
              created_at: "2011-06-23T03:55:34Z",
              created_by: {
                user: {
                  id: 1234,
                  first_name: 'Jimmy',
                  last_name: 'Page',
                  email: 'jimmy@example.com',
                  time_zone: 'Eastern Time (US & Canada)',
                  created_at: '2011-07-15T11:30:36-04:00',
                  updated_at: '2012-01-01T12:04:21-05:00',
                  avatar_file_size: 12345,
                  avatar_file_name: 'MyPhoto.png',
                  avatar_content_type: 'image/png',
                  avatar_updated_at: '2011-12-17T12:04:20-05:00',
                },
              },
            },
          },
          {
            bug: {
              id: 2160200,
              type: "bug",
              title: "Performance issue with retrieving the current project",
              due_date: null,
              description: null,
              identifier: 260200,
              assigned_to: {
                user: {
                  id: 1234,
                  first_name: 'Jimmy',
                  last_name: 'Page',
                  email: 'jimmy@example.com',
                  time_zone: 'Eastern Time (US & Canada)',
                  created_at: '2011-07-15T11:30:36-04:00',
                  updated_at: '2012-01-01T12:04:21-05:00',
                  avatar_file_size: 12345,
                  avatar_file_name: 'MyPhoto.png',
                  avatar_content_type: 'image/png',
                  avatar_updated_at: '2011-12-17T12:04:20-05:00',
                },
              },
              priority: 2,
              archived: false,
              project_id: projectId,
              updated_at: "2011-10-01T16:29:29Z",
              created_at: "2011-06-25T03:25:32Z",
              created_by: {
                user: {
                  id: 1234,
                  first_name: 'Jimmy',
                  last_name: 'Page',
                  email: 'jimmy@example.com',
                  time_zone: 'Eastern Time (US & Canada)',
                  created_at: '2011-07-15T11:30:36-04:00',
                  updated_at: '2012-01-01T12:04:21-05:00',
                  avatar_file_size: 12345,
                  avatar_file_name: 'MyPhoto.png',
                  avatar_content_type: 'image/png',
                  avatar_updated_at: '2011-12-17T12:04:20-05:00',
                },
              },
            },
          }];

          nock('https://valid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets').reply(200, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
          moraleApi.getTickets(projectId, this.callback);
        },
        "should not return an error": function(res, err) {
          assert.isNull(err);
        },
        "should return a populated array": function(res, err) {
          assert.isArray(res);
          assert.isNotEmpty(res);
        },
        "should contain a task or bug ticket": function(res, err) {
          assert.isArray(res);
          assert.isNotEmpty(res);
          var ticketType = Object.getOwnPropertyNames(res[0])[0];
          assert.include(["bug", "task"], ticketType);
          assert.isObject(res[0][ticketType]);
        },
      },
      "with a project that does not exist": {
        topic: function(moraleApi) {
          var projectId = 60404;
          var nockResponseData = {
            error: "Project does not exist",
          };

          nock('https://valid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets').reply(404, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
          moraleApi.getTickets(projectId, this.callback);
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
      "with an invalid projectId value": {
        "should throw an error": function() {
          assert.throws(function(moraleApi) {
            moraleApi.getTickets("badProjectIdValue", this.callback);
          }, Error);
        },
      },
    },
    "retriving a specific ticket": {
      "with a project that exists": {
		topic: 61200,
        "with a ticket that exists": {
          topic: function(projectId, moraleApi) {
            var ticketId = 161200;
            var nockResponseData = {
              id: 1161200,
              type: "task",
              title: "Create forgot password page",
              due_date: null,
              description: null,
              identifier: ticketId,
              assigned_to: null,
              priority: 2,
              archived: false,
              project_id: projectId,
              updated_at: "2011-09-01T18:49:25Z",
              created_at: "2011-06-23T03:55:34Z",
              created_by: {
                user: {
                  id: 1234,
                  first_name: 'Jimmy',
                  last_name: 'Page',
                  email: 'jimmy@example.com',
                  time_zone: 'Eastern Time (US & Canada)',
                  created_at: '2011-07-15T11:30:36-04:00',
                  updated_at: '2012-01-01T12:04:21-05:00',
                  avatar_file_size: 12345,
                  avatar_file_name: 'MyPhoto.png',
                  avatar_content_type: 'image/png',
                  avatar_updated_at: '2011-12-17T12:04:20-05:00',
                },
              },
            };

            nock('https://valid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets/' + ticketId).reply(200, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
            moraleApi.getTicket(projectId, ticketId, this.callback);
          },
          "should not return an error": function(res, err) {
            assert.isNull(err);
          },
          "should return the requested project": function(res, err) {
            assert.isObject(res);
            assert.include(res, "id");
            assert.include(res, "title");
            assert.include(res, "identifier");
            assert.isNumber(res.identifier);
            assert.equal(res.identifier, 161200);
            assert.include(res, "project_id");
            assert.isNumber(res.project_id);
            assert.equal(res.project_id, 61200);
          },
        },
        "with a ticket that does not exist": {
          topic: function(projectId, moraleApi) {
            var ticketId = 161404;
            var nockResponseData = {
              error: "Ticket does not exist",
            };

            nock('https://valid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets/' + ticketId).reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
            moraleApi.getTicket(projectId, ticketId, this.callback);
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
          "should return a Ticket Not Found error message": function(res, err) {
            assert.isObject(err);
            assert.include(err, "message");
            assert.isString(err.message);
            assert.equal(err.message, "Ticket does not exist");
          },
        },
        "with an invalid ticketId value": {
          "should throw an error": function(projectId, moraleApi) {
            assert.throws(function(projectId, moraleApi) {
              moraleApi.getTicket(projectId, "badTicketIdValue", this.callback);
            }, Error);
          },
        },
      },
      "with a project that does not exist": {
        topic: function(moraleApi) {
          var projectId = 61404;
          var ticketId = 161404;
          var nockResponseData = {
            error: "Project does not exist",
          };

          nock('https://valid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets/' + ticketId).reply(404, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
          moraleApi.getTicket(projectId, ticketId, this.callback);
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
      "with an invalid projectId value": {
        "should throw an error": function() {
          assert.throws(function(moraleApi) {
            moraleApi.getTicket("badProjectIdValue", 12345, this.callback);
          }, Error);
        },
      },
    },
  },
}).addBatch({
  "with an invalid credentials": {
    topic: morale('invalid-account', 'someApiKey'),
    "retriving a list of tickets": {
      topic: function(moraleApi) {
        var projectId = 70401;

        nock('https://invalid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets').reply(401, "", {
          'content-type': 'text/plain'
        });
        moraleApi.getTickets(projectId, this.callback);
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
    "retriving a specific ticket": {
      topic: function(moraleApi) {
        var projectId = 71401;
        var taskId = 171401
        nock('https://invalid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets/' + taskId).reply(401, "", {
          'content-type': 'text/plain'
        });
        moraleApi.getTicket(projectId, taskId, this.callback);
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
