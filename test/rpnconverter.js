const infixToPostfix = require('../rpnconverter').infixToPostfix;
const expect = require('chai').expect;

describe('Infix -> Postfix converter', function() {
  it('should convert "a" to "a"', function() {
    let infixString = 'a';
    expect(infixToPostfix(infixString)).to.equal('a');
  });
});