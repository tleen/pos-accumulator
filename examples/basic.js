'use strict';

var PosAccumulator = require('..');

var pa = new PosAccumulator();

pa.put('This is an example string.');
console.log(pa.lookup('example'));
// { pos: 'NN', count: 1 }

pa.put('This is another example string. There has been more than one example.');
console.log(pa.lookup('example'));
// { pos: 'NN', count: 3 }

console.log(pa.pos('NN'));
// [ { value: 'example', count: 3 }, { value: 'one', count: 1 } ]

console.log(pa.toJSON());
// {"configuration":{"insensitive":true},"data":{"DT":[{"value":"this","count":2},{"value":"an","count":1},{"value":"another","count":1}],"VBZ":[{"value":"is","count":2},{"value":"has","count":1}],"NN":[{"value":"example","count":3},{"value":"one","count":1}],"VBG":[{"value":"string","count":2}],".":[{"value":".","count":3}],"EX":[{"value":"there","count":1}],"VBN":[{"value":"been","count":1}],"JJR":[{"value":"more","count":1}],"IN":[{"value":"than","count":1}]}}


