const infixToPostfix = require('../rpnconverter').infixToPostfix;
const expect = require('chai').expect;

describe('Infix -> Postfix converter', function() {
  it('should convert "a" to "a"', function() {
    let infixString = 'a';
    expect(infixToPostfix(infixString)).to.equal('a');
  });
  it('should handle a single operator', function() {
    let infixString = 'a+b';
    expect(infixToPostfix(infixString)).to.equal('ab+');
  });
  it('should handle a chain of operators of equal precedence', function() {
    let infixString = 'a+b+c+d';
    expect(infixToPostfix(infixString)).to.equal('abcd+++');
  });
});