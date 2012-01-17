var vows = require('vows'),
    assert = require('assert'),
    nock = require('nock'),
    morale = require('../index.js');

vows.describe("Configuration Tests").addBatch({
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
}).export(module);
