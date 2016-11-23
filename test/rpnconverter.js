const infixToPostfix = require('../rpnconverter').infixToPostfix;
const expect = require('chai').expect;

describe('Infix -> Postfix converter', function() {
  it('should convert "a" to "a"', function() {
    let infixString = 'a';
    expect(infixToPostfix(infixString)).to.equal('a');
  });
  it('should convert "a+b" to "ab+"', function() {
    let infixString = 'a+b';
    expect(infixToPostfix(infixString)).to.equal('ab+');
  });
});