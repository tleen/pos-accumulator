'use strict';

/* global describe, it, should */
/* jshint expr: true */

var pkg = require('../package.json');

var PosAggregator = require('..'),
samples = require('./samples.json');


describe('versioning', function(){
  it('should have same version as package', function(){
    pkg.version.should.equal((new PosAggregator()).version);
  });
});

describe('single string storage', function(){

  it('should store a short string', function(){
    var pa = new PosAggregator();
    pa.put(samples.short);

    (pa.lookup('nonexist string') === null).should.be.true;
    pa.lookup('simple').should.be.a.Object.
      and.have.properties({pos : 'JJ', count : 3});
  });

  it('should store a long string', function(){
    var pa = new PosAggregator();
    pa.put(samples.long);

    (pa.lookup('nonexist string') === null).should.be.true;
    pa.lookup('the').should.be.a.Object.
      and.have.properties({pos : 'DT', count : 13});
  });

});

describe('aggregated storage', function(){  
  it('should return same values from single and aggregated', function(){

    var paOnce = new PosAggregator();
    paOnce.put(samples.multiple.join('\n'));

    var paMultiple = new PosAggregator();
    samples.multiple.forEach(function(line){ paMultiple.put(line); });

    paOnce.toJSON().should.equal(paMultiple.toJSON());
  });

});

describe('case sensitivity', function(){
  it.skip('is not implemented yet', function(){

  });
});
