const rpnconverter = require('../rpnconverter');
const infixToPostfix = rpnconverter.infixToPostfix;

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
  it('should convert provided examples properly', function() {
    expect(infixToPostfix('a+b-c')).to.equal('abc-+');
    expect(infixToPostfix('(a+b)-c')).to.equal('ab+c-');
    expect(infixToPostfix('l/m^n*o-p')).to.equal('lmn^/o*p-');
    expect(infixToPostfix('((l/(m^n))*o)-p')).to.equal('lmn^/o*p-');
    expect(infixToPostfix('((v/w)^x)*(y-z)')).to.equal('vw/x^yz-*');
  });
});

describe('Infix -> Postfix error handling', function() {
  it('should error on an invalid character', function() {
    let infixString = 'A';
    let func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Invalid character 'A'");
  });
  it('should error on mismatched closing parenthesis', function() {
    let infixString = 'a+b)-c';
    let func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Mismatched closing parenthesis");
  });
  it('should error on two adjacent operators', function() {
    let infixString = 'a+b+-c';
    let func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Operator '-' is in an invalid position");
  });
  it('should error on two adjacent operands', function() {
    let infixString = 'a+bc+d';
    let func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Operand 'c' is in an invalid position");
  });
});