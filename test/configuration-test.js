var morale = require('../index.js'),
    mocha = require('mocha'),
    should = require('should');

describe("Configuring Morale", function() {
  configuringMorale = function(subdomain, key) {
    return function() {
      return morale(subdomain, key);
    };
  };

  describe("with no key", function() {
    //var key = undefined;
    describe("and with no subdomain", function() {
      //var subdomain = undefined;
      it("should fail", function() {
        configuringMorale().should.throw();
      });
    });
    describe("and with a valid subdomain", function() {
      var subdomain = "sub-domain";
      it("should fail", function() {
        configuringMorale(subdomain).should.throw(/invalid key/i);
      });
    });
  });

  describe("with a null key", function() {
    var key = null;
    describe("and with a valid subdomain", function() {
      var subdomain = "sub-domain";
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid key/i);
      });
    });
  });

  describe("with an object key", function() {
    var key = {};
    describe("and with a valid subdomain", function() {
      var subdomain = "sub-domain";
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid key/i);
      });
    });
  });

  describe("with a function key", function() {
    var key = function() {
      return "abcdefg";
    };
    describe("and with a valid subdomain", function() {
      var subdomain = "sub-domain";
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid key/i);
      });
    });
  });

  describe("with a numeric key", function() {
    var key = 5;
    describe("and with a valid subdomain", function() {
      var subdomain = "sub-domain";
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid key/i);
      });
    });
  });

  describe("with an empty key", function() {
    var key = "";
    describe("and with a valid subdomain", function() {
      var subdomain = "sub-domain";
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid key/i);
      });
    });
  });

  describe("with a valid key", function() {
    var key = "abcdefg";
    describe("and with no subdomain", function() {
      //var subdomain = undefined;
      it("should fail", function() {
        configuringMorale(undefined, key).should.throw(/invalid subdomain/i);
      });
    });
    describe("and with a null subdomain", function() {
      var subdomain = null;
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid subdomain/i);
      });
    });
    describe("and with an object subdomain", function() {
      var subdomain = {};
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid subdomain/i);
      });
    });
    describe("and with a function subdomain", function() {
      var subdomain = function() {
        return "sub-domain";
      };
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid subdomain/i);
      });
    });
    describe("and with a numeric subdomain", function() {
      var subdomain = 5;
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid subdomain/i);
      });
    });
    describe("and with an empty subdomain", function() {
      var subdomain = "";
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid subdomain/i);
      });
    });
    describe("and with a subdomain containing invalid characters", function() {
      var subdomain = "sub^domain";
      it("should fail", function() {
        configuringMorale(subdomain, key).should.throw(/invalid subdomain/i);
      });
    });
    describe("and with a valid subdomain", function() {
      var subdomain = "sub-domain";
      it("should fail", function() {
        configuringMorale(subdomain, key).should.not.throw();
      });
    });
  });
});
