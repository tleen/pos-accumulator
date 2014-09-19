'use strict';

// xx - add toString for pa probably like "PosAggregator : 5 entries, 3 types \i"
// xx - add input validation + tests for validation
// xx - add to travis

var pkg = require('./package.json'),
pos = require('pos'),
_ = require('lodash');

function Dictionary(){
  this.data = {};
}

Dictionary.prototype.has = function(key){
  return _.has(this.data, key);
};

Dictionary.prototype.put = function(key, value){
  var i = 0, entry, slot;
  
  if(!this.has(key)) this.data[key] = [];

  entry = this.data[key];
  slot = undefined;
  for(i; i < entry.length; i++){
    if(entry[i].value === value) slot = entry[i]; // case insens?
  }

  if(slot === undefined) this.data[key].push({value : value, count : 1});
  else slot.count++;  
};

Dictionary.prototype.get = function(key){
  if(!this.has(key)) return undefined;
  return this[key];
};


// lookup may need to return multiple keys, depending on how pos is bucketing these
Dictionary.prototype.lookup = function(value){
  // if value return (first?) {key : key, count : count}
  // else return null

  var returner = null;
  _.each(this.data, function(slots, key){
    var found = _.where(slots, {'value' : value});
    if(found.length !== 0){
      returner =  {key : key, count : found[0].count};
      return false; // exit this each loop early
    }
  });

  return returner;
};

Dictionary.prototype.log = function(){
  console.log(this.data);
};

Dictionary.prototype.entries = function(){
  return _.cloneDeep(this.data);
};

function PosAggregator(configuration){
  this.version = pkg.version;
  this.dictionary = new Dictionary();

  this.configuration = _.chain({}).defaults(configuration, {insensitive : true}).pick('insensitive').valueOf();

}

PosAggregator.prototype.put = function(data){
  // check data, bail on undefined, (convert others to string?)
  var source = (this.configuration.insensitive ? data.toLowerCase() : data);
  var words = new pos.Lexer().lex(source);
  var tags = new pos.Tagger().tag(words);
  
  tags.forEach(function(pair){
    this.put(pair[1], pair[0]);
  }, this.dictionary);
};

// a single word
PosAggregator.prototype.lookup = function(word){
// screen for string?
  var term = (this.configuration.insensitive ? word.toLowerCase() : word);

  var found = this.dictionary.lookup(term);
  if(found !== null) return {pos : found.key, count : found.count};
  return null;
};

PosAggregator.prototype.log = function(){
  this.dictionary.log();
};

PosAggregator.prototype.toJSON = function(){
  return JSON.stringify({
    configuration : this.configuration,
    data : this.dictionary.entries()});
};

module.exports = PosAggregator;
