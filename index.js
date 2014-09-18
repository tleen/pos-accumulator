'use strict';

var pkg = require('./package.json');

function PosAggregator(){
  this.version = pkg.version;
}


module.exports = PosAggregator;
