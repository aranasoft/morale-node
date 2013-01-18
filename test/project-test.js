var nock = require('nock'),
  util = require('util'),
  morale = require('../index.js'),
  mocha = require('mocha'),
  should = require('should');

describe("When accessing the Project API", function () {
  describe("with valid Morale credentials,", function () {
    var moraleApi = morale("subdomain", "abcdefg");

    describe("adding a project", function () {
      var project = {
        name: "Test Project #3"
      };

      beforeEach(function (done) {
        if (nock) {
          var nockRequestData = {
            project: {
              name: project.name
            }
          };
          var nockResponseData = {
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
        done();
      });

      it("should return without an error", function (done) {
        moraleApi.addProject(project, done);
      });
      it("should return the new project", function (done) {
        moraleApi.addProject(project, function (err, res) {
          if (err) { return done(err); }
          res.should.have.property("name", "Test Project #3");
          res.should.have.property("account_id");
          res.should.have.property("id");
          done();
        });
      });
    });

    describe("retriving a list of projects", function () {
      var project = {
        name: "Test Project #3"
      };

      beforeEach(function (done) {
        if (nock) {
          var nockResponseData = [{
            "project": {
              id: 120,
              name: "Test Project #1",
              account_id: 1,
              updated_at: "2011-09-01T18:49:25Z",
              created_at: "2011-06-23T03:55:34Z"
            }
          }];
          nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects').reply(200, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
        }
        done();
      });

      it("should return without an error", function (done) {
        moraleApi.getProjects(done);
      });
      it("should return a populated array", function (done) {
        moraleApi.getProjects(function (err, res) {
          if (err) { return done(err); }
          res.should.be.instanceOf(Array);
          res.should.not.be.empty;
          done();
        });
      });
      it("should contain a project", function (done) {
        moraleApi.getProjects(function (err, res) {
          if (err) { return done(err); }
          res.should.be.instanceOf(Array);
          res.should.not.be.empty;
          res[0].should.have.property("project");
          done();
        });
      });
    });

    describe("and with a project that exists,", function () {
      var projectId = 21200;

      describe("retrieving a project", function () {
        beforeEach(function (done) {
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
          done();
        });

        it("should return without an error", function (done) {
          moraleApi.getProject(projectId, done);
        });
        it("should return the new project", function (done) {
          moraleApi.getProject(projectId, function (err, res) {
            if (err) { return done(err); }
            res.should.have.property("name");
            res.should.have.property("account_id");
            res.should.have.property("id", projectId);
            done();
          });
        });
      });

      describe("updating a project", function () {
        var project = {
          id: projectId,
          name: "Test Project #4"
        };

        beforeEach(function (done) {
          if (nock) {
            var nockRequestData = {
              project: {
                name: project.name
              }
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
          done();
        });

        it("should return without an error", function (done) {
          moraleApi.updateProject(project, done);
        });
        it("should return the new project", function (done) {
          moraleApi.updateProject(project, function (err, res) {
            if (err) { return done(err); }
            res.should.have.property("name", project.name);
            res.should.have.property("account_id");
            res.should.have.property("id", projectId);
            done();
          });
        });
      });

      describe("deleting a project", function () {
        beforeEach(function (done) {
          if (nock) {
            var nockResponseData = {
              id: projectId,
              name: "Sample Project That Was Deleted",
              account_id: 1,
              updated_at: "2011-09-01T18:49:25Z",
              created_at: "2011-06-23T03:55:34Z"
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain))["delete"]('/api/v1/projects/' + projectId).reply(200, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }
          done();
        });

        it("should return without an error", function (done) {
          moraleApi.deleteProject(projectId, done);
        });
        it("should return the new project", function (done) {
          moraleApi.deleteProject(projectId, function (err, res) {
            if (err) { return done(err); }
            res.should.have.property("name");
            res.should.have.property("account_id");
            res.should.have.property("id", projectId);
            done();
          });
        });
      });

    });

    describe("and with a project that does not exist,", function () {
      var projectId = 41404;

      describe("retrieving a project", function () {
        beforeEach(function (done) {
          if (nock) {
            var nockResponseData = {
              error: "Project does not exist"
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId).reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }
          done();
        });

        it("should return a 404 code", function (done) {
          moraleApi.getProject(projectId, function (err, res) {
            should.exist(err);
            err.should.have.status(404);
            done();
          });
        });
        it("should return a project not found", function (done) {
          moraleApi.getProject(projectId, function (err, res) {
            should.exist(err);
            err.message.should.equal("Project does not exist");
            done();
          });
        });
        it("should not return data", function (done) {
          moraleApi.getProject(projectId, function (err, res) {
            should.not.exist(res);
            done();
          });
        });
      });

      describe("updating a project", function () {
        var project = {
          id: projectId,
          name: "Test Project #4"
        };

        beforeEach(function (done) {
          if (nock) {
            var nockRequestData = {
              project: {
                name: project.name
              }
            };
            var nockResponseData = {
              error: "Project does not exist"
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).put('/api/v1/projects/' + project.id, JSON.stringify(nockRequestData)).reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }
          done();
        });

        it("should return a 404 code", function (done) {
          moraleApi.updateProject(project, function (err, res) {
            should.exist(err);
            err.should.have.status(404);
            done();
          });
        });
        it("should return a project not found", function (done) {
          moraleApi.updateProject(project, function (err, res) {
            should.exist(err);
            err.message.should.equal("Project does not exist");
            done();
          });
        });
        it("should not return data", function (done) {
          moraleApi.updateProject(project, function (err, res) {
            should.not.exist(res);
            done();
          });
        });
      });

      describe("deleting a project", function () {
        beforeEach(function (done) {
          if (nock) {
            var nockResponseData = {
              error: "Project does not exist"
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain))["delete"]('/api/v1/projects/' + projectId).reply(404, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
          }
          done();
        });

        it("should return a 404 code", function (done) {
          moraleApi.deleteProject(projectId, function (err, res) {
            should.exist(err);
            err.should.have.status(404);
            done();
          });
        });
        it("should return a project not found", function (done) {
          moraleApi.deleteProject(projectId, function (err, res) {
            should.exist(err);
            err.message.should.equal("Project does not exist");
            done();
          });
        });
        it("should not return data", function (done) {
          moraleApi.deleteProject(projectId, function (err, res) {
            should.not.exist(res);
            done();
          });
        });
      });

    });
  });

  describe('with invalid Morale credentials,', function () {
    var moraleApi = morale("invalid-account", "invalidKey");

    describe("adding a project", function () {
      var project = {
        name: "Test Project #3"
      };

      beforeEach(function (done) {
        if (nock) {
          var nockRequestData = {
            project: {
              name: project.name
            }
          };
          nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).post('/api/v1/projects', JSON.stringify(nockRequestData)).reply(401, "", {
            'content-type': 'text/plain'
          });
        }
        done();
      });

      it("should return a 401 code", function (done) {
        moraleApi.addProject(project, function (err, res) {
          should.exist(err);
          err.should.have.status(401);
          done();
        });
      });
      it("should return an unauthorized message", function (done) {
        moraleApi.addProject(project, function (err, res) {
          should.exist(err);
          err.message.should.equal("Unauthorized");
          done();
        });
      });
      it("should not return data", function (done) {
        moraleApi.addProject(project, function (err, res) {
          should.not.exist(res);
          done();
        });
      });
    });

    describe("retriving a list of projects", function () {
      var project = {
        name: "Test Project #3"
      };

      beforeEach(function (done) {
        if (nock) {
          nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects').reply(401, "", {
            'content-type': 'text/plain'
          });
        }
        done();
      });

      it("should return a 401 code", function (done) {
        moraleApi.getProjects(function (err, res) {
          should.exist(err);
          err.should.have.status(401);
          done();
        });
      });
      it("should return an unauthorized message", function (done) {
        moraleApi.getProjects(function (err, res) {
          should.exist(err);
          err.message.should.equal("Unauthorized");
          done();
        });
      });
      it("should not return data", function (done) {
        moraleApi.getProjects(function (err, res) {
          should.not.exist(res);
          done();
        });
      });
    });

    describe("and with any project id,", function () {
      var projectId = 12345;

      describe("retrieving a project", function () {
        beforeEach(function (done) {
          if (nock) {
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).get('/api/v1/projects/' + projectId).reply(401, "", {
              'content-type': 'text/plain'
            });
          }
          done();
        });

        it("should return a 401 code", function (done) {
          moraleApi.getProject(projectId, function (err, res) {
            should.exist(err);
            err.should.have.status(401);
            done();
          });
        });
        it("should return an unauthorized message", function (done) {
          moraleApi.getProject(projectId, function (err, res) {
            should.exist(err);
            err.message.should.equal("Unauthorized");
            done();
          });
        });
        it("should not return data", function (done) {
          moraleApi.getProject(projectId, function (err, res) {
            should.not.exist(res);
            done();
          });
        });
      });

      describe("updating a project", function () {
        var project = {
          id: projectId,
          name: "Project Should Not Get Created"
        };

        beforeEach(function (done) {
          if (nock) {
            var nockRequestData = {
              project: {
                name: project.name
              }
            };
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain)).put('/api/v1/projects/' + project.id, JSON.stringify(nockRequestData)).reply(401, "", {
              'content-type': 'text/plain'
            });
          }
          done();
        });

        it("should return a 401 code", function (done) {
          moraleApi.updateProject(project, function (err, res) {
            should.exist(err);
            err.should.have.status(401);
            done();
          });
        });
        it("should return an unauthorized message", function (done) {
          moraleApi.updateProject(project, function (err, res) {
            should.exist(err);
            err.message.should.equal("Unauthorized");
            done();
          });
        });
        it("should not return data", function (done) {
          moraleApi.updateProject(project, function (err, res) {
            should.not.exist(res);
            done();
          });
        });
      });

      describe("deleting a project", function () {
        beforeEach(function (done) {
          if (nock) {
            nock(util.format('https://%s.teammorale.com', moraleApi.options.subdomain))["delete"]('/api/v1/projects/' + projectId).reply(401, "", {
              'content-type': 'text/plain'
            });
          }
          done();
        });

        it("should return a 401 code", function (done) {
          moraleApi.deleteProject(projectId, function (err, res) {
            should.exist(err);
            err.should.have.status(401);
            done();
          });
        });
        it("should return an unauthorized message", function (done) {
          moraleApi.deleteProject(projectId, function (err, res) {
            should.exist(err);
            err.message.should.equal("Unauthorized");
            done();
          });
        });
        it("should not return data", function (done) {
          moraleApi.deleteProject(projectId, function (err, res) {
            should.not.exist(res);
            done();
          });
        });
      });

    });
  });
});
