var nock = require('nock'),
    util = require('util'),
    morale = require('../index.js'),
    mocha = require('mocha'),
    should = require('should');

describe("When requesting an API Key against Morale", function() {
  describe("with a valid Morale subdomain,", function() {
    var subdomain = "validSubdomain";
    describe("with valid Morale credentials,", function() {
      var apiKey = "AbCdEfGh123456";
      var email = "someUser@testemail.com";
      var password = "validPassword";
      beforeEach(function(done) {
        if (nock) {
          var nockRequestData = util.format("email=%s&password=%s", email, password);
          var nockResponseData = {
            api_key: apiKey
          };
          nock(util.format('https://%s.teammorale.com', subdomain.toLowerCase())).post('/api/v1/in', nockRequestData)
            .reply(200, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
        }
        done();
      });
      it("should return an API token", function(done) {
        morale.GetApiToken(subdomain, email, password, function(err, res) {
          if (err) return done(err);
          res.should.have.property("api_key", apiKey);
          done();
        });
      });
    });
    describe("with invalid Morale credentials,", function() {
      var apiKey = "AbCdEfGh123456";
      var email = "someUser@testemail.com";
      var password = "invalidPassword";
      beforeEach(function(done) {
        if (nock) {
          var nockRequestData = util.format("email=%s&password=%s", email, password);
          var nockResponseData = {
            error: "Invalid credentials"
          };
          nock(util.format('https://%s.teammorale.com', subdomain.toLowerCase())).post('/api/v1/in', nockRequestData)
            .reply(401, JSON.stringify(nockResponseData), {
              'content-type': 'application/json'
            });
        }
        done();
      });
      it("should return a 401 code", function(done) {
        morale.GetApiToken(subdomain, email, password, function(err, res) {
          should.exist(err);
          err.should.have.status(401);
          done();
        });
      });
      it("should return an invalid credentials message", function(done) {
        morale.GetApiToken(subdomain, email, password, function(err, res) {
          should.exist(err);
          err.message.should.equal("Invalid credentials");
          done();
        });
      });
      it("should not return data", function(done) {
        morale.GetApiToken(subdomain, email, password, function(err, res) {
          should.not.exist(res);
          done();
        });
      });
    });
  });
  describe("with an invalid Morale subdomain,", function() {
    var subdomain = "thisShouldNotExist";
    var apiKey = "AbCdEfGh123456";
    var email = "someUser@testemail.com";
    var password = "validPassword";
    beforeEach(function(done) {
      if (nock) {
        var nockRequestData = util.format("email=%s&password=%s", email, password);
        var nockResponseData = {
          error: util.format("Account '%s' does not exist", subdomain.toLowerCase())
        };
        nock(util.format('https://%s.teammorale.com', subdomain.toLowerCase())).post('/api/v1/in', nockRequestData)
          .reply(404, JSON.stringify(nockResponseData), {
            'content-type': 'application/json'
          });
      }
      done();
    });
    it("should return a 404 code", function(done) {
      morale.GetApiToken(subdomain, email, password, function(err, res) {
        should.exist(err);
        err.should.have.status(404);
        done();
      });
    });
    it("should return an invalid account message", function(done) {
      morale.GetApiToken(subdomain, email, password, function(err, res) {
        should.exist(err);
        err.message.should.equal(util.format("Account '%s' does not exist", subdomain.toLowerCase()));
        done();
      });
    });
    it("should not return data", function(done) {
      morale.GetApiToken(subdomain, email, password, function(err, res) {
        should.not.exist(res);
        done();
      });
    });
  });
});
