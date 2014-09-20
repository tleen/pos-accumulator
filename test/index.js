'use strict';

/* global describe, it, should */
/* jshint expr: true */

var pkg = require('../package.json');

var PosAccumulator = require('..'),
samples = require('./samples.json');


describe('version()', function(){
  it('should have same version as package', function(){
    pkg.version.should.equal((new PosAccumulator()).version);
  });
});

describe('put()', function(){

  it('should store a short string', function(){
    var pa = new PosAccumulator();
    pa.put(samples.short);

    (pa.lookup('nonexist string') === null).should.be.true;
    pa.lookup('simple').should.be.a.Object
      .and.have.properties({pos : 'JJ', count : 3});
  });

  it('should store a long string', function(){
    var pa = new PosAccumulator();
    pa.put(samples.long);

    (pa.lookup('nonexist string') === null).should.be.true;
    pa.lookup('the').should.be.a.Object
      .and.have.properties({pos : 'DT', count : 13});
  });

  it('should return same values from single and aggregated', function(){

    var paOnce = new PosAccumulator();
    paOnce.put(samples.multiple.join('\n'));

    var paMultiple = new PosAccumulator();
    samples.multiple.forEach(function(line){ paMultiple.put(line); });

    paOnce.toJSON().should.equal(paMultiple.toJSON());
  });

  it('should not store empty/null/undefined strings', function(){
    var pa = new PosAccumulator();
    pa.put(samples.long);
    
    var json = pa.toJSON();
    ['', undefined, null].forEach(function(val){
      pa.put(val);
      json.should.equal(pa.toJSON());
    });
  });
});


describe('.putCount()', function(){
  var pa = new PosAccumulator();
  
  it('should start at 0', function(){
    pa.putCount().should.be.an.Number
      .and.equal(0);
  });

  it('should count puts()', function(){
    samples.multiple.forEach(function(line){ pa.put(line); });
    pa.putCount().should.equal(samples.multiple.length);
  });

  it('should not count bad puts()', function(){
    pa.put(undefined);
    pa.put('');
    pa.putCount().should.equal(samples.multiple.length);
  });
});

describe('.entryCount()', function(){
  var pa = new PosAccumulator();
  pa.put(samples.long);
 
  it('should count all terms in accumulator', function(){
    pa.entryCount().should.be.a.Number
      .and.equal(114);
  });

  it('should count single type in accumulator', function(){
    pa.entryCount('NN').should.be.a.Number
      .and.equal(41);

    pa.entryCount('VB').should.be.a.Number
      .and.equal(4);
  });
});

describe('{insensitive : true}', function(){
  it('should ignore case', function(){
    var pa = new PosAccumulator();
    pa.put(samples.short);
    pa.lookup('simple').should.be.a.Object
      .and.have.properties({count : 3});
  });

  it('should not ignore case when insensitive is false', function(){
    var pai = new PosAccumulator({insensitive : false});
    pai.put(samples.short);
    pai.lookup('simple').should.be.a.Object
      .and.have.properties({count : 2});
    pai.lookup('Simple').should.be.a.Object
      .and.have.properties({count : 1});
  });
});

describe('.term()', function(){
  var pa = new PosAccumulator();
  pa.put(samples.long);

  it('should return undefined for bad term value', function(){
    (pa.pos('foo') === undefined).should.be.true;
  });

  it('should return null for empty term value', function(){
    (pa.pos() === null).should.be.true;
  });

  it('should return valid term dictionaries', function(){
    pa.pos('VBP').should.be.an.Object
      .and.have.property(0).and.be.an.Object
      .and.have.properties({value : 'am', count : 2});

    pa.pos('NN').should.be.an.Object
      .and.have.lengthOf(41);
  });
});


describe('.lookup()', function(){

  var pa = new PosAccumulator();
  pa.put(samples.long);
      
  it('should return null for empty strings', function(){  
    ['', undefined, null].forEach(function(val){
      (pa.lookup(val) === null).should.be.true;
    });
  });

  it('should return null for non-exist value', function(){
    (pa.lookup('foobar') === null).should.be.true;
  });

  it('should lookup proper key, count pairs', function(){
    pa.lookup('floor').should.be.an.Object
      .and.have.properties({pos : 'NN', count : 1});

    pa.lookup('the').should.be.an.Object
      .and.have.properties({pos : 'DT', count : 13});
  });


});
