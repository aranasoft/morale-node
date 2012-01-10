var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    morale = require('../index.js');

exports.setupTests = vows.describe("Configuration Tests").addBatch({
  "configuring Morale without specifying options": {
    "should fail": function() {
      assert.throws(function() {
        morale()
      }, Error);
    },
  },
  "configuring Morale without specifying a key": {
    "should fail": function() {
      assert.throws(function() {
        morale("sub-domain")
      }, Error);
    },
  },
  "configuring Morale with a non-string subdomain": {
    "should fail": function() {
      assert.throws(function() {
        morale(5, "key")
      }, Error);
    },
  },
  "configuring Morale with an empty-string subdomain": {
    "should fail": function() {
      assert.throws(function() {
        morale("", "key")
      }, Error);
    },
  },
  "configuring Morale with a subdomain having invalid characters": {
    "should fail": function() {
      assert.throws(function() {
        morale("sub_domain", "key")
      }, Error);
    },
  },
  "configuring Morale with a non-string key": {
    "should fail": function() {
      assert.throws(function() {
        morale("sub-domain", 5)
      }, Error);
    },
  },
  "configuring Morale with an empty-string key": {
    "should fail": function() {
      assert.throws(function() {
        morale("sub-domain", "")
      }, Error);
    },
  },
  "configuring Morale with a non-empty string subdomain and non-empty string key": {
    "should not fail": function(topic) {
      assert.doesNotThrow(function() {
        return morale("sub-domain", "key")
      }, ReferenceError);
    },
  },
});

exports.projectApiTests = vows.describe('Project API Tests').addBatch({
  "with a valid credentials": {
    topic: morale("valid-account", "someApiKey"),
    "retriving a list of projects": {
      topic: function(moraleApi) {
        var nockResponseData = [{                              
		   project:
		   {
		     id: 41,
		     name: "Test Project #1",
		     account_id: 1,
		     updated_at: "2011-09-01T18:49:25Z",
		     created_at: "2011-06-23T03:55:34Z"
		   },
		   project:
		   {
		     id: 42,
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
    "retriving a specific project": {
      topic: function(moraleApi) {
        var nockResponseData = {
		  id: 41,
		  name: "Test Project #1",
		  account_id: 1,
		  updated_at: "2011-09-01T18:49:25Z",
		  created_at: "2011-06-23T03:55:34Z"
		};

        nock('https://valid-account.teammorale.com').get('/api/v1/projects/41').reply(200, JSON.stringify(nockResponseData), {
          'content-type': 'application/json'
        });
        moraleApi.getProject(41, this.callback);
      },
      "should not return an error": function(res, err) {
        assert.isNull(err);
      },
      "should return project data": function(res, err) {
        assert.isObject(res);
        assert.include(res, "name");
        assert.include(res, "account_id");
        assert.include(res, "id");
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
    "retriving a specific project": {
      topic: function(moraleApi) {
        nock('https://invalid-account.teammorale.com').get('/api/v1/projects/90').reply(401, "", {
          'content-type': 'text/plain'
        });
        moraleApi.getProject(90, this.callback);
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
});
