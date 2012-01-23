var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    util = require('util'),
    morale = require('../index.js');

require('./assert.js');

vows.describe('Ticket API Tests').addBatch({
  "with valid credentials": {
    topic: morale("subdomain", "abcdefg"),
    "with a project that exists": {
      topic: 21200,
      "getting a list of tickets": {
        topic: function(projectId, moraleApi) {
          if (nock) {
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
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId + '/tickets').reply(200, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }

          moraleApi.getTickets(projectId, this.callback);
        },
        "should not return an error": assert.noAsyncError(),
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
      "adding a new ticket": {
        topic: function(projectId, moraleApi) {
          var ticket = {
            type: "Bug",
            title: "A Brand New Ticket",
            project_id: projectId,
          };

          if (nock) {
            var commandString = util.format("type: %s title: %s", ticket.type, ticket.title);
            var nockRequestData = {
              command: commandString,
            };
            var nockResponseData = {
              id: 1162200,
              type: ticket.type,
              title: ticket.title,
              due_date: null,
              description: null,
              identifier: 17,
              assigned_to: null,
              priority: null,
              archived: false,
              project_id: ticket.project_id,
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
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }

          moraleApi.addTicket(ticket, this.callback);
        },
        "should not return an error": assert.noAsyncError(),
        "should return the new ticket": function(res, err) {
          assert.isObject(res);
          assert.include(res, "id");
          assert.include(res, "title");
          assert.isString(res.title);
          assert.equal(res.title, "A Brand New Ticket");
          assert.include(res, "type");
          assert.isString(res.type);
          assert.equal(res.type, "Bug");
          assert.include(res, "identifier");
          assert.isNumber(res.identifier);
          assert.greater(res.identifier, 0);
          assert.include(res, "project_id");
          assert.isNumber(res.project_id);
          assert.equal(res.project_id, this.context.topics[0]);
        },
      },
      "with a ticket that exists": {
        topic: 13,
        "retrieving a specific ticket": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            if (nock) {
              var nockResponseData = {
                id: 1161200,
                type: "task",
                title: "Create forgot password page",
                due_date: null,
                description: null,
                identifier: ticketIdentifier,
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
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId + '/tickets/' + ticketIdentifier).reply(200, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }

            moraleApi.getTicket(projectId, ticketIdentifier, this.callback);
          },
          "should not return an error": assert.noAsyncError(),
          "should return the requested project": function(res, err) {
            assert.isObject(res);
            assert.include(res, "id");
            assert.include(res, "title");
            assert.include(res, "identifier");
            assert.isNumber(res.identifier);
            assert.equal(res.identifier, this.context.topics[0]);
            assert.include(res, "project_id");
            assert.isNumber(res.project_id);
            assert.equal(res.project_id, this.context.topics[1]);
          },
        },
        "updating a ticket": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            var ticket = {
              type: "Task",
              title: "An Updated Ticket Title",
              description: "And we will add this new description",
              project_id: projectId,
              identifier: ticketIdentifier,
            };

            if (nock) {
              var commandString = util.format("#%s: type: %s title: %s description: %s", ticket.identifier, ticket.type, ticket.title, ticket.description);
              var nockRequestData = {
                command: commandString,
              };
              var nockResponseData = {
                id: 1162200,
                type: ticket.type,
                title: ticket.title,
                due_date: null,
                description: ticket.description,
                identifier: ticket.identifier,
                assigned_to: null,
                priority: null,
                archived: false,
                project_id: ticket.project_id,
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
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }

            moraleApi.updateTicket(ticket, this.callback);
          },
          "should not return an error": assert.noAsyncError(),
          "should return the new ticket": function(res, err) {
            assert.isObject(res);
            assert.include(res, "id");
            assert.include(res, "title");
            assert.isString(res.title);
            assert.equal(res.title, "An Updated Ticket Title");
            assert.include(res, "description");
            assert.isString(res.description);
            assert.equal(res.description, "And we will add this new description");
            assert.include(res, "type");
            assert.isString(res.type);
            assert.equal(res.type, "Task");
            assert.include(res, "identifier");
            assert.isNumber(res.identifier);
            assert.equal(res.identifier, this.context.topics[0]);
            assert.include(res, "project_id");
            assert.isNumber(res.project_id);
            assert.equal(res.project_id, this.context.topics[1]);
          },
        },
        "archiving a ticket": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            if (nock) {
              var nockRequestData = {
                command: util.format("a #%s:", ticketIdentifier),
              };
              var nockResponseData = {
                id: 1167200,
                type: "task",
                title: "Archived Ticket Title",
                due_date: null,
                description: null,
                identifier: ticketIdentifier,
                assigned_to: null,
                priority: null,
                archived: true,
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
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }

            moraleApi.archiveTicket(projectId, ticketIdentifier, this.callback);
          },
          "should not return an error": assert.noAsyncError(),
          "should return the archived ticket": function(res, err) {
            assert.isObject(res);
            assert.include(res, "id");
            assert.include(res, "archived");
            assert.isBoolean(res.archived);
            assert.equal(res.archived, true);
            assert.include(res, "identifier");
            assert.isNumber(res.identifier);
            assert.equal(res.identifier, this.context.topics[0]);
            assert.include(res, "project_id");
            assert.isNumber(res.project_id);
            assert.equal(res.project_id, this.context.topics[1]);
          },
        },
        "deleting a ticket": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            if (nock) {
              var commandString = util.format("d #%s:", ticketIdentifier);
              var nockRequestData = {
                command: commandString,
              };
              var nockResponseData = {
                id: 1167200,
                type: "task",
                title: "Archived Ticket Title",
                due_date: null,
                description: null,
                identifier: ticketIdentifier,
                assigned_to: null,
                priority: null,
                archived: true,
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
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }

            moraleApi.deleteTicket(projectId, ticketIdentifier, this.callback);
          },
          "should not return an error": assert.noAsyncError(),
          "should return the deleted ticket": function(res, err) {
            assert.isObject(res);
            assert.include(res, "id");
            assert.include(res, "identifier");
            assert.isNumber(res.identifier);
            assert.equal(res.identifier, this.context.topics[0]);
            assert.include(res, "project_id");
            assert.isNumber(res.project_id);
            assert.equal(res.project_id, this.context.topics[1]);
          },
        },
        "running a ticket command": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            var commandString = util.format("archive #%s:", ticketIdentifier);

            if (nock) {
              var nockRequestData = {
                command: commandString,
              };
              var nockResponseData = {
                id: 1167200,
                type: "task",
                title: "Archived Ticket Title",
                due_date: null,
                description: null,
                identifier: ticketIdentifier,
                assigned_to: null,
                priority: null,
                archived: true,
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
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }

            moraleApi.runTicketCommand(projectId, commandString, this.callback);
          },
          "should not return an error": assert.noAsyncError(),
          "should return the updated ticket": function(res, err) {
            assert.isObject(res);
            assert.include(res, "id");
            assert.include(res, "archived");
            assert.isBoolean(res.archived);
            assert.equal(res.archived, true);
            assert.include(res, "identifier");
            assert.isNumber(res.identifier);
            assert.equal(res.identifier, this.context.topics[0]);
            assert.include(res, "project_id");
            assert.isNumber(res.project_id);
            assert.equal(res.project_id, this.context.topics[1]);
          },
        },
      },
      "with a ticket that does not exist": {
        topic: 200404,
        "retrieving a specific ticket": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            if (nock) {
              var nockResponseData = {
                error: "Ticket does not exist",
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId + '/tickets/' + ticketIdentifier).reply(404, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }

            moraleApi.getTicket(projectId, ticketIdentifier, this.callback);
          },
          "should not return data": assert.noAsyncResult(),
          "should return an http 404 status code": assert.asyncStatusCode(404),
          "should return a Ticket Not Found error message": assert.asyncStatusMessage("Ticket does not exist"),
        },
        "updating a ticket": {
          //Bug in Morale returns text/html
        },
        "archiving a ticket": {
          //Bug in Morale returns text/html
        },
        "deleting a ticket": {
          //Bug in Morale returns "Unable to parse the command" error, even thought he command is parseable.
        },
      },
      "with an invalid ticketId value": {
        topic: "badTicketIdValue",
        "getting a specific ticket": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            return function() {
              moraleApi.getTicket(projectId, ticketIdentifier, function() {
                console.log("This Should Not Run")
              });
            };
          },
          "should throw an error": assert.throwsError(),
        },
      },
    },
    "with a project that does not exist": {
      topic: 100404,
      "getting a list of tickets": {
        topic: function(projectId, moraleApi) {
          if (nock) {
            var nockResponseData = {
              error: "Project does not exist",
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId + '/tickets').reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }
          moraleApi.getTickets(projectId, this.callback);
        },
        "should not return data": assert.noAsyncResult(),
        "should return an http 404 status code": assert.asyncStatusCode(404),
        "should return a Project Not Found error message": assert.asyncStatusMessage("Project does not exist"),
      },
      "adding a new ticket": {
        topic: function(projectId, moraleApi) {
          var ticket = {
            type: "task",
            title: "A Brand New Ticket",
            project_id: projectId,
          };

          if (nock) {
            var nockRequestData = {
              command: util.format("type: %s title: %s", ticket.type, ticket.title),
            };
            var nockResponseData = {
              error: "Project does not exist",
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }

          moraleApi.addTicket(ticket, this.callback);
        },
        "should not return data": assert.noAsyncResult(),
        "should return an http 404 status code": assert.asyncStatusCode(404),
        "should return a Project Not Found error message": assert.asyncStatusMessage("Project does not exist"),
      },
      "with a ticket that exists": {
        topic: 200200,
        "getting a specific ticket": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            if (nock) {
              var nockResponseData = {
                error: "Project does not exist",
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId + '/tickets/' + ticketIdentifier).reply(404, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }

            moraleApi.getTicket(projectId, ticketIdentifier, this.callback);
          },
          "should not return data": assert.noAsyncResult(),
          "should return an http 404 status code": assert.asyncStatusCode(404),
          "should return a Project Not Found error message": assert.asyncStatusMessage("Project does not exist"),
        },
        "updating a ticket": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            var ticket = {
              type: "task",
              title: "An Updated Ticket Title",
              description: "And we will add this new description",
              project_id: projectId,
              identifier: ticketIdentifier,
            };

            if (nock) {
              var commandString = util.format("#%s: type: %s title: %s description: %s", ticket.identifier, ticket.type, ticket.title, ticket.description);
              var nockRequestData = {
                command: commandString,
              };
              var nockResponseData = {
                error: "Project does not exist",
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }

            moraleApi.updateTicket(ticket, this.callback);
          },
          "should not return data": assert.noAsyncResult(),
          "should return an http 404 status code": assert.asyncStatusCode(404),
          "should return a Project Not Found error message": assert.asyncStatusMessage("Project does not exist"),
        },
        "archiving a ticket": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            if (nock) {
              var nockRequestData = {
                command: util.format("a #%s:", ticketIdentifier),
              };
              var nockResponseData = {
                error: "Project does not exist",
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }

            moraleApi.archiveTicket(projectId, ticketIdentifier, this.callback);
          },
          "should not return data": assert.noAsyncResult(),
          "should return an http 404 status code": assert.asyncStatusCode(404),
          "should return a Project Not Found error message": assert.asyncStatusMessage("Project does not exist"),
        },
        "deleting a ticket": {
          topic: function(ticketIdentifier, projectId, moraleApi) {
            if (nock) {
              var nockRequestData = {
                command: util.format("d #%s:", ticketIdentifier),
              };
              var nockResponseData = {
                error: "Project does not exist",
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }

            moraleApi.deleteTicket(projectId, ticketIdentifier, this.callback);
          },
          "should not return data": assert.noAsyncResult(),
          "should return an http 404 status code": assert.asyncStatusCode(404),
          "should return a Project Not Found error message": assert.asyncStatusMessage("Project does not exist"),
        },
      },
    },
    "with an invalid projectId value": {
      topic: "badProjectIdValue",
      "getting a list of tickets": {
        topic: function(projectId, moraleApi) {
          return function() {
            moraleApi.getTickets(projectId, function() {
              console.log("This Should Not Run")
            });
          };
        },
        "should throw an error": assert.throwsError(),
      },
      "getting a specific ticket": {
        topic: function(projectId, moraleApi) {
          return function() {
            moraleApi.getTicket(projectId, 12345, function() {
              console.log("This Should Not Run")
            });
          };
        },
        "should throw an error": assert.throwsError(),
      },
    },
  },
}).addBatch({
  "with invalid credentials": {
    topic: morale('invalid-account', 'someApiKey'),
    "retriving a list of tickets": {
      topic: function(moraleApi) {
        var projectId = 70401;

        if (nock) {
          nock('https://invalid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets').reply(401, "", {
            'content-type': 'text/plain'
          });
        }

        moraleApi.getTickets(projectId, this.callback);
      },
      "should not return data": assert.noAsyncResult(),
      "should return an http 401 status code": assert.asyncStatusCode(401),
      "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
    },
    "retriving a specific ticket": {
      topic: function(moraleApi) {
        var projectId = 1;
        var ticketIdentifier = 2;
        if (nock) {
          nock('https://invalid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets/' + ticketIdentifier).reply(401, "", {
            'content-type': 'text/plain'
          });
        }

        moraleApi.getTicket(projectId, ticketIdentifier, this.callback);
      },
      "should not return data": assert.noAsyncResult(),
      "should return an http 401 status code": assert.asyncStatusCode(401),
      "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
    },
    "adding a new ticket": {
      topic: function(moraleApi) {
        var ticket = {
          type: "task",
          title: "A Brand New Ticket",
          project_id: 1,
        };

        if (nock) {
          var commandString = util.format("type: %s title: %s", ticket.type, ticket.title);
          var nockRequestData = {
            command: commandString,
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects/' + ticket.project_id + '/tickets', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }

        moraleApi.addTicket(ticket, this.callback);
      },
      "should not return data": assert.noAsyncResult(),
      "should return an http 401 status code": assert.asyncStatusCode(401),
      "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
    },
    "updating a new ticket": {
      topic: function(moraleApi) {
        var ticket = {
          type: "task",
          title: "A Brand New Ticket",
          project_id: 1,
          identifier: 2,
        };

        if (nock) {
          var commandString = util.format("#%s: type: %s title: %s", ticket.identifier, ticket.type, ticket.title);
          var nockRequestData = {
            command: commandString,
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects/' + ticket.project_id + '/tickets', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }

        moraleApi.updateTicket(ticket, this.callback);
      },
      "should not return data": assert.noAsyncResult(),
      "should return an http 401 status code": assert.asyncStatusCode(401),
      "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
    },
    "archiving a new ticket": {
      topic: function(moraleApi) {
        var projectId = 1;
        var ticketIdentifier = 2;

        if (nock) {
          var nockRequestData = {
            command: util.format("a #%s:", ticketIdentifier),
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }

        moraleApi.archiveTicket(projectId, ticketIdentifier, this.callback);
      },
      "should not return data": assert.noAsyncResult(),
      "should return an http 401 status code": assert.asyncStatusCode(401),
      "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
    },
    "deleting a new ticket": {
      topic: function(moraleApi) {
        var projectId = 1;
        var ticketIdentifier = 2;

        if (nock) {
          var nockRequestData = {
            command: util.format("d #%s:", ticketIdentifier),
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }

        moraleApi.deleteTicket(projectId, ticketIdentifier, this.callback);
      },
      "should not return data": assert.noAsyncResult(),
      "should return an http 401 status code": assert.asyncStatusCode(401),
      "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
    },
    "running a ticket command": {
      topic: function(moraleApi) {
        var projectId = 1;
        var ticketIdentifier = 2;
        var commandString = util.format("archive #%s:", ticketIdentifier);

        if (nock) {
          var nockRequestData = {
            command: commandString,
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }

        moraleApi.runTicketCommand(projectId, commandString, this.callback);
      },
      "should not return data": assert.noAsyncResult(),
      "should return an http 401 status code": assert.asyncStatusCode(401),
      "should return an http 401 error message": assert.asyncStatusMessage("Unauthorized"),
    },
  },
}).addBatch({
  "building a ticket command string": {
    "with a ticket object": {
      topic: function(moraleApi) {
        var ticket = {
          type: "task",
          title: "Create forgot password page",
          due_date: null,
          description: null,
          identifier: 10,
          assigned_to: "Jay",
          priority: 2,
          project_id: 101,
          someOtherKey: "someValue",
        };
        return morale('doesnt', 'matter')._buildTicketCommand(ticket);
      },
      "should include acceptable properties": function(topic) {
        assert.include(topic, "type: task");
        assert.include(topic, "title: Create forgot password page");
        assert.include(topic, "description: ");
        assert.include(topic, "due_date: ");
        assert.include(topic, "assigned_to: Jay");
        assert.include(topic, "priority: 2");
      },
      "should not include blocked properties": function(topic) {
        assert.exclude(topic, "identifier: ");
        assert.exclude(topic, "project_id: ");
      },
      "should not include unknown properties": function(topic) {
        assert.exclude(topic, "someOtherKey: ");
      },
    },
  },
}).export(module);
