var vows = require('vows'),
    assert = require('assert');

assert.asyncStatusCode = function(code) {
  return function(res, err) {
    assert.isObject(err);
    assert.include(err, "statusCode");
    assert.isNumber(err.statusCode);
    assert.equal(err.statusCode, code);
  };
};

assert.asyncStatusMessage = function(message) {
  return function(res, err) {
    assert.isObject(err);
    assert.include(err, "message");
    assert.isString(err.message);
    assert.equal(err.message, message);
  };
};

assert.noAsyncResult = function() {
  return function(res, err) {
    assert.isNull(res);
  };
};

assert.noAsyncError = function() {
  return function(res, err) {
    assert.isNull(err);
  };
};

assert.doesNotThrowError = function() {
  return function(topic) {
    assert.doesNotThrow(topic, Error);
  };
};

assert.throwsError = function() {
  return function(topic) {
    assert.throws(topic, Error);
  };
};

assert.throwsReferenceError = function() {
  return function(topic) {
    assert.throws(topic, ReferenceError);
  };
};

assert.exclude = function(actual, expected, message) {
  if (!(function(obj) {
    if (typeof obj === 'array' || typeof obj === 'string') {
      return obj.indexOf(expected) === -1;
    } else if (typeof obj === 'object') {
      return !obj.hasOwnProperty(expected);
    }
    return true;
  })(actual)) {
    assert.fail(actual, expected, message || "expected {actual} to exclude {expected}", "exclude", assert.exclude);
  }
};
assert.excludes = assert.exclude;

assert.configurationShouldFail = function(morale) {
  var context = {
    topic: function(subdomain, key) {
      return function() {
        morale(subdomain, key);
      }
    },
    "should thro an error": assert.throwsError(),
  };
  return context;
};
assert.configurationShouldSucceed = function(morale) {
  var context = {
    topic: function(subdomain, key) {
      return function() {
        morale(subdomain, key);
      }
    },
    "should succeed": function(){this.context.topics[0]();},
  };
  return context;
};
