var nock = require('nock'),
  util = require('util'),
  morale = require('../index.js'),
  mocha = require('mocha'),
  should = require('should');

describe("When accessing the Ticket API", function () {
  describe("with valid Morale credentials,", function () {
    var moraleApi = morale("subdomain", "abcdefg");

    describe("and with a project that exists,", function () {
      var projectId = 21200;

      describe("getting a list of tickets", function () {
        beforeEach(function (done) {
          if (nock) {
            var nockResponseData = [
                {
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
                        avatar_updated_at: '2011-12-17T12:04:20-05:00'
                      }
                    }
                  }
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
                        avatar_updated_at: '2011-12-17T12:04:20-05:00'
                      }
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
                        avatar_updated_at: '2011-12-17T12:04:20-05:00'
                      }
                    }
                  }
                }
              ];
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId + '/tickets').reply(200, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }
          done();
        });

        it("should return without an error", function (done) {
          moraleApi.getTickets(projectId, done);
        });
        it("should return a populated array", function (done) {
          moraleApi.getTickets(projectId, function (err, res) {
            if (err) { return done(err); }
            res.should.be.instanceOf(Array);
            res.should.not.be.empty;
            done();
          });
        });
        it("should contain a task or bug ticket", function (done) {
          moraleApi.getTickets(projectId, function (err, res) {
            if (err) { return done(err); }
            res.should.be.instanceOf(Array);
            res.should.not.be.empty;
            var ticketType = Object.getOwnPropertyNames(res[0])[0];
            ["bug", "task"].should.include(ticketType);
            done();
          });
        });
      });

      describe("adding a new ticket", function () {
        var ticket = {
          type: "Bug",
          title: "A Brand New Ticket",
          project_id: projectId
        };

        beforeEach(function (done) {
          if (nock) {
            var commandString = util.format("type: %s title: %s", ticket.type, ticket.title);
            var nockRequestData = {
              command: commandString
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
                  avatar_updated_at: '2011-12-17T12:04:20-05:00'
                }
              }
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }
          done();
        });

        it("should return without an error", function (done) {
          moraleApi.addTicket(ticket, done);
        });
        it("should return the new ticket", function (done) {
          moraleApi.addTicket(ticket, function (err, res) {
            if (err) { return done(err); }
            res.should.have.property("id").above(0);
            res.should.have.property("title", ticket.title);
            res.should.have.property("type", ticket.type);
            res.should.have.property("identifier").above(0);
            res.should.have.property("project_id", projectId);
            done();
          });
        });
      });

      describe("and with a ticket that exists,", function () {
        var ticketIdentifier = 13;

        describe("getting a ticket", function () {
          beforeEach(function (done) {
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
                    avatar_updated_at: '2011-12-17T12:04:20-05:00'
                  }
                }
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId + '/tickets/' + ticketIdentifier).reply(200, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }
            done();
          });

          it("should return without an error", function (done) {
            moraleApi.getTicket(projectId, ticketIdentifier, done);
          });
          it("should return the requested ticket", function (done) {
            moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
              if (err) { return done(err); }
              res.should.have.property("id").above(0);
              res.should.have.property("title");
              res.should.have.property("type");
              res.should.have.property("identifier", ticketIdentifier);
              res.should.have.property("project_id", projectId);
              done();
            });
          });
        });

        describe("updating a ticket", function () {
          var ticket = {
            type: "Task",
            title: "An Updated Ticket Title",
            description: "And we will add this new description",
            project_id: projectId,
            identifier: ticketIdentifier
          };

          beforeEach(function (done) {
            if (nock) {
              var commandString = util.format("#%s: type: %s title: %s description: %s", ticket.identifier, ticket.type, ticket.title, ticket.description);
              var nockRequestData = {
                command: commandString
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
                    avatar_updated_at: '2011-12-17T12:04:20-05:00'
                  }
                }
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }
            done();
          });

          it("should return without an error", function (done) {
            moraleApi.updateTicket(ticket, done);
          });
          it("should return the requested ticket", function (done) {
            moraleApi.updateTicket(ticket, function (err, res) {
              if (err) { return done(err); }
              res.should.have.property("id").above(0);
              res.should.have.property("title", ticket.title);
              res.should.have.property("type", ticket.type);
              res.should.have.property("description", ticket.description);
              res.should.have.property("identifier", ticketIdentifier);
              res.should.have.property("project_id", projectId);
              done();
            });
          });
        });

        describe("archiving a ticket", function () {
          beforeEach(function (done) {
            if (nock) {
              var nockRequestData = {
                command: util.format("a #%s:", ticketIdentifier)
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
                    avatar_updated_at: '2011-12-17T12:04:20-05:00'
                  }
                }
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }
            done();
          });

          it("should return without an error", function (done) {
            moraleApi.archiveTicket(projectId, ticketIdentifier, done);
          });
          it("should return the archived ticket", function (done) {
            moraleApi.archiveTicket(projectId, ticketIdentifier, function (err, res) {
              if (err) { return done(err); }
              res.should.have.property("id").above(0);
              res.should.have.property("title")["with"].a("string");
              res.should.have.property("type")["with"].a("string");
              res.should.have.property("description");
              res.should.have.property("archived")["with"]["true"];
              res.should.have.property("identifier", ticketIdentifier);
              res.should.have.property("project_id", projectId);
              done();
            });
          });
        });

        describe("deleting a ticket", function () {
          beforeEach(function (done) {
            if (nock) {
              var commandString = util.format("d #%s:", ticketIdentifier);
              var nockRequestData = {
                command: commandString
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
                    avatar_updated_at: '2011-12-17T12:04:20-05:00'
                  }
                }
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }
            done();
          });

          it("should return without an error", function (done) {
            moraleApi.deleteTicket(projectId, ticketIdentifier, done);
          });
          it("should return the deleted ticket", function (done) {
            moraleApi.deleteTicket(projectId, ticketIdentifier, function (err, res) {
              if (err) { return done(err); }
              res.should.have.property("id").above(0);
              res.should.have.property("title")["with"].a("string");
              res.should.have.property("type")["with"].a("string");
              res.should.have.property("description");
              res.should.have.property("identifier", ticketIdentifier);
              res.should.have.property("project_id", projectId);
              done();
            });
          });
        });

        describe("running a ticket command", function () {
          var commandString = util.format("archive #%s:", ticketIdentifier);

          beforeEach(function (done) {
            if (nock) {
              var nockRequestData = {
                command: commandString
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
                    avatar_updated_at: '2011-12-17T12:04:20-05:00'
                  }
                }
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(200, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }
            done();
          });

          it("should return without an error", function (done) {
            moraleApi.runTicketCommand(projectId, commandString, done);
          });
          it("should return the affected ticket", function (done) {
            moraleApi.runTicketCommand(projectId, commandString, function (err, res) {
              if (err) { return done(err); }
              res.should.have.property("id").above(0);
              res.should.have.property("title")["with"].a("string");
              res.should.have.property("type")["with"].a("string");
              res.should.have.property("description");
              res.should.have.property("archived")["with"]["true"];
              res.should.have.property("identifier", ticketIdentifier);
              res.should.have.property("project_id", projectId);
              done();
            });
          });
        });
      });

      describe("and with a ticket that does not exist,", function () {
        var ticketIdentifier = 41404;

        describe("getting a ticket", function () {
          beforeEach(function (done) {
            if (nock) {
              var nockResponseData = {
                error: "Ticket does not exist"
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId + '/tickets/' + ticketIdentifier).reply(404, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }
            done();
          });

          it("should return a 404 code", function (done) {
            moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
              should.exist(err);
              err.should.have.status(404);
              done();
            });
          });
          it("should return a project not found", function (done) {
            moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
              should.exist(err);
              err.message.should.equal("Ticket does not exist");
              done();
            });
          });
          it("should not return data", function (done) {
            moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
              should.not.exist(res);
              done();
            });
          });
        });

        describe("updating a ticket", function () {
          beforeEach(function (done) {
            //if (nock) {}
            done();
          });

          it("should return a 404 code");
          /*it("should return a 404 code", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.exist(err);
							err.should.have.status(404);
							done();
						});
					};*/
          it("should return a project not found");
          /*it("should return a project not found", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.exist(err);
							err.message.should.equal("Ticket does not exist");
							done();
						});
          );*/
          it("should not return data");
          /*it("should not return data", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.not.exist(res);
							done();
						});
					};*/
        });

        describe("archiving a ticket", function () {
          beforeEach(function (done) {
            //if (nock) {}
            done();
          });

          it("should return a 404 code");
          /*it("should return a 404 code", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.exist(err);
							err.should.have.status(404);
							done();
						});
					};*/
          it("should return a project not found");
          /*it("should return a project not found", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.exist(err);
							err.message.should.equal("Ticket does not exist");
							done();
						});
					};*/
          it("should not return data");
          /*it("should not return data", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.not.exist(res);
							done();
						});
					};*/
        });

        describe("deleting a ticket", function () {
          beforeEach(function (done) {
            //if (nock) {}
            done();
          });

          it("should return a 404 code");
          /*it("should return a 404 code", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.exist(err);
							err.should.have.status(404);
							done();
						});
					};*/
          it("should return a project not found");
          /*it("should return a project not found", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.exist(err);
							err.message.should.equal("Ticket does not exist");
							done();
						});
					};*/
          it("should not return data");
          /*it("should not return data", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.not.exist(res);
							done();
						});
					};*/
        });

        describe("running a ticket command", function () {
          beforeEach(function (done) {
            //if (nock) {}
            done();
          });

          it("should return a 404 code");
          /*it("should return a 404 code", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.exist(err);
							err.should.have.status(404);
							done();
						});
					};*/
          it("should return a project not found");
          /*it("should return a project not found", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.exist(err);
							err.message.should.equal("Ticket does not exist");
							done();
						});
					};*/
          it("should not return data");
          /*it("should not return data", function (done) {  //Bug in Morale
						moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
							should.not.exist(res);
							done();
						});
					};*/
        });
      });

      describe("and with an invalid ticket identifier,", function () {
        var ticketIdentifier = "invalid identifier";

        describe("getting a ticket", function () {
          it("should throw an error", function () {
            var getTicketWrapper = function () {
              return moraleApi.getTicket(projectId, ticketIdentifier, function () {
                console.log("This should not run");
              });
            };
            getTicketWrapper.should["throw"]("FAIL: INVALID TICKETID");
          });
        });
      });
    });

    describe("and with a project that does not exist,", function () {
      var projectId = 21200;

      describe("getting a list of tickets", function () {
        beforeEach(function (done) {
          if (nock) {
            var nockResponseData = {
              error: "Project does not exist"
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId + '/tickets').reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }
          done();
        });

        it("should return a 404 code", function (done) {
          moraleApi.getTickets(projectId, function (err, res) {
            should.exist(err);
            err.should.have.status(404);
            done();
          });
        });
        it("should return an unauthorized message", function (done) {
          moraleApi.getTickets(projectId, function (err, res) {
            should.exist(err);
            err.message.should.equal("Project does not exist");
            done();
          });
        });
        it("should not return data", function (done) {
          moraleApi.getTickets(projectId, function (err, res) {
            should.not.exist(res);
            done();
          });
        });
      });

      describe("adding a new ticket", function () {
        var ticket = {
          type: "task",
          title: "A Brand New Ticket",
          project_id: projectId
        };

        beforeEach(function (done) {
          if (nock) {
            var nockRequestData = {
              command: util.format("type: %s title: %s", ticket.type, ticket.title)
            };
            var nockResponseData = {
              error: "Project does not exist"
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }
          done();
        });

        it("should return a 404 code", function (done) {
          moraleApi.addTicket(ticket, function (err, res) {
            should.exist(err);
            err.should.have.status(404);
            done();
          });
        });
        it("should return an unauthorized message", function (done) {
          moraleApi.addTicket(ticket, function (err, res) {
            should.exist(err);
            err.message.should.equal("Project does not exist");
            done();
          });
        });
        it("should not return data", function (done) {
          moraleApi.addTicket(ticket, function (err, res) {
            should.not.exist(res);
            done();
          });
        });
      });

      describe("with a valid ticket identifier", function () {
        var ticketIdentifier = 12345;

        describe("getting a specific ticket", function () {
          beforeEach(function (done) {
            if (nock) {
              var nockResponseData = {
                error: "Project does not exist"
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId + '/tickets/' + ticketIdentifier).reply(404, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }
            done();
          });

          it("should return a 404 code", function (done) {
            moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
              should.exist(err);
              err.should.have.status(404);
              done();
            });
          });
          it("should return an unauthorized message", function (done) {
            moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
              should.exist(err);
              err.message.should.equal("Project does not exist");
              done();
            });
          });
          it("should not return data", function (done) {
            moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
              should.not.exist(res);
              done();
            });
          });
        });

        describe("updating a ticket", function () {
          var ticket = {
            type: "task",
            title: "An Updated Ticket Title",
            description: "And we will add this new description",
            project_id: projectId,
            identifier: ticketIdentifier
          };

          beforeEach(function (done) {
            if (nock) {
              var commandString = util.format("#%s: type: %s title: %s description: %s", ticket.identifier, ticket.type, ticket.title, ticket.description);
              var nockRequestData = {
                command: commandString
              };
              var nockResponseData = {
                error: "Project does not exist"
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }
            done();
          });

          it("should return a 404 code", function (done) {
            moraleApi.updateTicket(ticket, function (err, res) {
              should.exist(err);
              err.should.have.status(404);
              done();
            });
          });
          it("should return an unauthorized message", function (done) {
            moraleApi.updateTicket(ticket, function (err, res) {
              should.exist(err);
              err.message.should.equal("Project does not exist");
              done();
            });
          });
          it("should not return data", function (done) {
            moraleApi.updateTicket(ticket, function (err, res) {
              should.not.exist(res);
              done();
            });
          });
        });

        describe("archiving a ticket", function () {
          beforeEach(function (done) {
            if (nock) {
              var nockRequestData = {
                command: util.format("a #%s:", ticketIdentifier)
              };
              var nockResponseData = {
                error: "Project does not exist"
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }
            done();
          });

          it("should return a 404 code", function (done) {
            moraleApi.archiveTicket(projectId, ticketIdentifier, function (err, res) {
              should.exist(err);
              err.should.have.status(404);
              done();
            });
          });
          it("should return an unauthorized message", function (done) {
            moraleApi.archiveTicket(projectId, ticketIdentifier, function (err, res) {
              should.exist(err);
              err.message.should.equal("Project does not exist");
              done();
            });
          });
          it("should not return data", function (done) {
            moraleApi.archiveTicket(projectId, ticketIdentifier, function (err, res) {
              should.not.exist(res);
              done();
            });
          });
        });

        describe("deleting a ticket", function () {
          beforeEach(function (done) {
            if (nock) {
              var nockRequestData = {
                command: util.format("d #%s:", ticketIdentifier)
              };
              var nockResponseData = {
                error: "Project does not exist"
              };
              nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
                'content-type': 'application/json'
              });
            }
            done();
          });

          it("should return a 404 code", function (done) {
            moraleApi.deleteTicket(projectId, ticketIdentifier, function (err, res) {
              should.exist(err);
              err.should.have.status(404);
              done();
            });
          });
          it("should return an unauthorized message", function (done) {
            moraleApi.deleteTicket(projectId, ticketIdentifier, function (err, res) {
              should.exist(err);
              err.message.should.equal("Project does not exist");
              done();
            });
          });
          it("should not return data", function (done) {
            moraleApi.deleteTicket(projectId, ticketIdentifier, function (err, res) {
              should.not.exist(res);
              done();
            });
          });
        });

      });
    });

    describe("and with an invalid projectId,", function () {
      var projectId = "badProjectIdValue";

      describe("getting a list of tickets", function () {
        it("should throw an error", function () {
          var getTicketWrapper = function () {
            return moraleApi.getTickets(projectId, function () {
              console.log("This should not run");
            });
          };
          getTicketWrapper.should["throw"]("FAIL: INVALID PROJECTID");
        });
      });

      describe("getting a specific ticket", function () {
        var ticketIdentifier = 12345;

        it("should throw an error", function () {
          var getTicketWrapper = function () {
            return moraleApi.getTicket(projectId, ticketIdentifier, function () {
              console.log("This should not run");
            });
          };
          getTicketWrapper.should["throw"]("FAIL: INVALID PROJECTID");
        });
      });
    });
  });

  describe("with invalid Morale credentials,", function () {
    var moraleApi = morale("invalid-account", "invalidKey");

    describe("getting a list of tickets", function () {
      var projectId = 70401;

      beforeEach(function (done) {
        if (nock) {
          nock('https://invalid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets').reply(401, "", {
            'content-type': 'text/plain'
          });
        }
        done();
      });

      it("should return a 401 code", function (done) {
        moraleApi.getTickets(projectId, function (err, res) {
          should.exist(err);
          err.should.have.status(401);
          done();
        });
      });
      it("should return an unauthorized message", function (done) {
        moraleApi.getTickets(projectId, function (err, res) {
          should.exist(err);
          err.message.should.equal("Unauthorized");
          done();
        });
      });
      it("should not return data", function (done) {
        moraleApi.getTickets(projectId, function (err, res) {
          should.not.exist(res);
          done();
        });
      });
    });

    describe("getting a specific ticket", function () {
      var projectId = 70401;
      var ticketIdentifier = 800401;

      beforeEach(function (done) {
        if (nock) {
          nock('https://invalid-account.teammorale.com').get('/api/v1/projects/' + projectId + '/tickets/' + ticketIdentifier).reply(401, "", {
            'content-type': 'text/plain'
          });
        }
        done();
      });

      it("should return a 401 code", function (done) {
        moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
          should.exist(err);
          err.should.have.status(401);
          done();
        });
      });
      it("should return an unauthorized message", function (done) {
        moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
          should.exist(err);
          err.message.should.equal("Unauthorized");
          done();
        });
      });
      it("should not return data", function (done) {
        moraleApi.getTicket(projectId, ticketIdentifier, function (err, res) {
          should.not.exist(res);
          done();
        });
      });
    });

    describe("adding a ticket", function () {
      var ticket = {
        type: "task",
        title: "A Brand New Ticket",
        project_id: 70401
      };

      beforeEach(function (done) {
        if (nock) {
          var commandString = util.format("type: %s title: %s", ticket.type, ticket.title);
          var nockRequestData = {
            command: commandString
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects/' + ticket.project_id + '/tickets', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }
        done();
      });

      it("should return a 401 code", function (done) {
        moraleApi.addTicket(ticket, function (err, res) {
          should.exist(err);
          err.should.have.status(401);
          done();
        });
      });
      it("should return an unauthorized message", function (done) {
        moraleApi.addTicket(ticket, function (err, res) {
          should.exist(err);
          err.message.should.equal("Unauthorized");
          done();
        });
      });
      it("should not return data", function (done) {
        moraleApi.addTicket(ticket, function (err, res) {
          should.not.exist(res);
          done();
        });
      });
    });

    describe("updating a ticket", function () {
      var ticket = {
        type: "task",
        title: "An Updated Ticket",
        project_id: 70401,
        identifier: 123
      };

      beforeEach(function (done) {
        if (nock) {
          var commandString = util.format("#%s: type: %s title: %s", ticket.identifier, ticket.type, ticket.title);
          var nockRequestData = {
            command: commandString
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects/' + ticket.project_id + '/tickets', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }
        done();
      });

      it("should return a 401 code", function (done) {
        moraleApi.updateTicket(ticket, function (err, res) {
          should.exist(err);
          err.should.have.status(401);
          done();
        });
      });
      it("should return an unauthorized message", function (done) {
        moraleApi.updateTicket(ticket, function (err, res) {
          should.exist(err);
          err.message.should.equal("Unauthorized");
          done();
        });
      });
      it("should not return data", function (done) {
        moraleApi.updateTicket(ticket, function (err, res) {
          should.not.exist(res);
          done();
        });
      });
    });

    describe("archiving a ticket", function () {
      var projectId = 70401;
      var ticketIdentifier = 800401;

      beforeEach(function (done) {
        if (nock) {
          var nockRequestData = {
            command: util.format("a #%s:", ticketIdentifier)
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }
        done();
      });

      it("should return a 401 code", function (done) {
        moraleApi.archiveTicket(projectId, ticketIdentifier, function (err, res) {
          should.exist(err);
          err.should.have.status(401);
          done();
        });
      });
      it("should return an unauthorized message", function (done) {
        moraleApi.archiveTicket(projectId, ticketIdentifier, function (err, res) {
          should.exist(err);
          err.message.should.equal("Unauthorized");
          done();
        });
      });
      it("should not return data", function (done) {
        moraleApi.archiveTicket(projectId, ticketIdentifier, function (err, res) {
          should.not.exist(res);
          done();
        });
      });
    });

    describe("deleting a ticket", function () {
      var projectId = 70401;
      var ticketIdentifier = 800401;

      beforeEach(function (done) {
        if (nock) {
          var nockRequestData = {
            command: util.format("d #%s:", ticketIdentifier)
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }
        done();
      });

      it("should return a 401 code", function (done) {
        moraleApi.deleteTicket(projectId, ticketIdentifier, function (err, res) {
          should.exist(err);
          err.should.have.status(401);
          done();
        });
      });
      it("should return an unauthorized message", function (done) {
        moraleApi.deleteTicket(projectId, ticketIdentifier, function (err, res) {
          should.exist(err);
          err.message.should.equal("Unauthorized");
          done();
        });
      });
      it("should not return data", function (done) {
        moraleApi.deleteTicket(projectId, ticketIdentifier, function (err, res) {
          should.not.exist(res);
          done();
        });
      });
    });

    describe("running a ticket command", function () {
      var projectId = 70401;
      var ticketIdentifier = 800401;
      var commandString = util.format("archive #%s:", ticketIdentifier);

      beforeEach(function (done) {
        if (nock) {
          var nockRequestData = {
            command: commandString
          };
          nock('https://invalid-account.teammorale.com').post('/api/v1/projects/' + projectId + '/tickets', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }
        done();
      });

      it("should return a 401 code", function (done) {
        moraleApi.runTicketCommand(projectId, commandString, function (err, res) {
          should.exist(err);
          err.should.have.status(401);
          done();
        });
      });
      it("should return an unauthorized message", function (done) {
        moraleApi.runTicketCommand(projectId, commandString, function (err, res) {
          should.exist(err);
          err.message.should.equal("Unauthorized");
          done();
        });
      });
      it("should not return data", function (done) {
        moraleApi.runTicketCommand(projectId, commandString, function (err, res) {
          should.not.exist(res);
          done();
        });
      });
    });
  });
});

describe("Building a ticket command", function () {
  var moraleApi = morale('doesnt', 'matter');
  moraleApi.runTicketCommand = function (projectId, command, callback) {
    return command;
  };
  var command;

  describe("with a valid ticket object", function () {
    var ticket = {
      type: "task",
      title: "Create forgot password page",
      due_date: null,
      description: null,
      identifier: 10,
      assigned_to: "Jay",
      priority: 2,
      project_id: 101,
      someOtherKey: "someValue"
    };

    beforeEach(function (done) {
      command = moraleApi.updateTicket(ticket, function () {});
      done();
    });

    it("should include acceptable properties", function () {
      command.should.include("type: task");
      command.should.include("title: Create forgot password page");
      command.should.include("description: ");
      command.should.include("due_date: ");
      command.should.include("assigned_to: Jay");
      command.should.include("priority: 2");
    });
    it("should not include blocked properties", function () {
      command.should.not.include("identifier: ");
      command.should.not.include("project_id: ");
    });
    it("should not include unknown properties", function () {
      command.should.not.include("someOtherKey: ");
    });
  });
});
