var vows = require('vows'),
    assert = require('assert'),
    morale = require('../index.js');

require('./assert.js');

vows.describe("Configuration Tests").addBatch({
  "with no key": {
    topic: undefined,
    "with no subdomain": {
      topic: undefined,
      "configuring morale": assert.configurationShouldFail(morale),
    },
    "with a valid subdomain": {
      topic: "sub-domain",
      "configuring morale": assert.configurationShouldFail(morale),
    },
  },
  "with a null key": {
    topic: null,
    "with a valid subdomain": {
      topic: "sub-domain",
      "configuring morale": assert.configurationShouldFail(morale),
    },
  },
  "with an object key": {
    topic: {},
    "with a valid subdomain": {
      topic: "sub-domain",
      "configuring morale": assert.configurationShouldFail(morale),
    },
  },
  "with an array key": {
    topic: {},
    "with a valid subdomain": {
      topic: "sub-domain",
      "configuring morale": assert.configurationShouldFail(morale),
    },
  },
  "with a function key": {
    topic: function() {
      return function() {
        return "aValidKeyStuckInsideAFunction"
      };
    },
    "with a valid subdomain": {
      topic: "sub-domain",
      "configuring morale": assert.configurationShouldFail(morale),
    },
  },
  "with a numeric key": {
    topic: 5,
    "with a valid subdomain": {
      topic: "sub-domain",
      "configuring morale": assert.configurationShouldFail(morale),
    },
  },
  "with an empty key": {
    topic: "",
    "with a valid subdomain": {
      topic: "sub-domain",
      "configuring morale": assert.configurationShouldFail(morale),
    },
  },
  "with a valid key": {
    topic: "abcdefg",
    "with no subdomain": {
      topic: undefined,
      "configuring morale": assert.configurationShouldFail(morale),
    },
    "with a null subdomain": {
      topic: null,
      "configuring morale": assert.configurationShouldFail(morale),
    },
    "with a object subdomain": {
      topic: {},
      "configuring morale": assert.configurationShouldFail(morale),
    },
    "with an array subdomain": {
      topic: [],
      "configuring morale": assert.configurationShouldFail(morale),
    },
    "with a function subdomain": {
      topic: function() {
        return function() {
          return "aValidSubdomainStuckInsideAFunction"
        };
      },
      "configuring morale": assert.configurationShouldFail(morale),
    },
    "with an empty subdomain": {
      topic: "",
      "configuring morale": assert.configurationShouldFail(morale),
    },
    "with a numeric subdomain": {
      topic: 5,
      "configuring morale": assert.configurationShouldFail(morale),
    },
    "with a subdomain having invalid characters": {
      topic: "sub^domain",
      "configuring morale": assert.configurationShouldFail(morale),
    },
    "with a valid subdomain": {
      topic: "sub-domain",
      "configuring morale": assert.configurationShouldSucceed(morale),
    },
  },
}).export(module);
