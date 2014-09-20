POS Accumulator
===============

[![Build Status](https://travis-ci.org/tleen/pos-accumulator.png?branch=master)](https://travis-ci.org/tleen/pos-accumulator)

Collects strings and builds a [parts-of-speech](https://github.com/dariusk/pos-js) lookup table of the contents.

## Example

```javascript
var PosAccumulator = require('pos-accumulator');

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
```


## Constructor

```javascript
var PosAccumulator = require('pos-accumulator');
var pa = new PosAccumulator();
```

Constructor takes an optional configuration object, the only option is **insensitive**.

### insensitive

Configuration option **insensitive** defaults to *true*, when enabled the accumulator will treat all strings as lowercase. This can be disabled by setting the configuration object as:

```javascript
var PosAccumulator = require('pos-accumulator');
var pa = new PosAccumulator({insensitive : false});
```
