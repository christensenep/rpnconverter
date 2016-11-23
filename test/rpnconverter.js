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
    expect(infixToPostfix(infixString)).to.equal('ab+c+d+');
  });
  it('should recognize all valid operators', function() {
    let infixString = 'a+b-c*d/e^f';
    expect(infixToPostfix(infixString)).to.equal('abcdef^/*-+');
  });
  it('should recognize operator precedence', function() {
    let infixString = 'a-b+c^d/e*f';
    expect(infixToPostfix(infixString)).to.equal('ab-cd^e/f*+');
  });
  it('should recognize single parenthetical grouping', function() {
    let infixString = 'a-(b+c^d)/e*f';
    expect(infixToPostfix(infixString)).to.equal('abcd^+e/f*-');
  });
  it('should recognize multiple, non-nested parenthetical groupings', function() {
    let infixString = 'a-(b+c^d)/(e*f)';
    expect(infixToPostfix(infixString)).to.equal('abcd^+ef*/-');
  });
  it('should recognize nested parenthetical groupings', function() {
    let infixString = 'a-((b+c)^(d/e))*f';
    expect(infixToPostfix(infixString)).to.equal('abc+de/^f*-');
  });
});