'use strict';

/* global describe, it, should */

var pkg = require('../package.json');

var PosAggregator = require('..');

describe('versioning', function(){
  it('should have same version as package', function(){
    pkg.version.should.equal((new PosAggregator()).version);
  });
});

