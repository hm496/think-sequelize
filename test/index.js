const test = require('ava');
const index = require('../index.js');
const helper = require('think-helper');

test('index is a function', t => {
  t.is(helper.isFunction(index), true);
});
