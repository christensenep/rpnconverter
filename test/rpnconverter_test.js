'use strict';

const rpnconverter = require('../rpnconverter');
const infixToPostfix = rpnconverter.infixToPostfix;
const postfixToInfix = rpnconverter.postfixToInfix;

const expect = require('chai').expect;

describe('Infix -> Postfix converter', () => {
  it('should convert empty string to empty string', () => {
    const infixString = '';
    expect(infixToPostfix(infixString)).to.equal('');
  });
  it('should convert a single operand', () => {
    const infixString = 'a';
    expect(infixToPostfix(infixString)).to.equal('a');
  });
  it('should handle a single operator', () => {
    const infixString = 'a+b';
    expect(infixToPostfix(infixString)).to.equal('ab+');
  });
  it('should handle a chain of operators of equal precedence', () => {
    const infixString = 'a+b+c+d';
    expect(infixToPostfix(infixString)).to.equal('ab+c+d+');
  });
  it('should recognize all valid operators', () => {
    const infixString = 'a+b-c*d/e^f';
    expect(infixToPostfix(infixString)).to.equal('abcdef^/*-+');
  });
  it('should recognize operator precedence', () => {
    const infixString = 'a-b+c^d/e*f';
    expect(infixToPostfix(infixString)).to.equal('ab-cd^e/f*+');
  });
  it('should recognize single parenthetical grouping', () => {
    const infixString = 'a-(b+c^d)/e*f';
    expect(infixToPostfix(infixString)).to.equal('abcd^+e/f*-');
  });
  it('should recognize multiple, non-nested parenthetical groupings', () => {
    const infixString = 'a-(b+c^d)/(e*f)';
    expect(infixToPostfix(infixString)).to.equal('abcd^+ef*/-');
  });
  it('should recognize nested parenthetical groupings', () => {
    const infixString = 'a-((b+c)^(d/e))*f';
    expect(infixToPostfix(infixString)).to.equal('abc+de/^f*-');
  });
  it('should convert provided examples properly', () => {
    expect(infixToPostfix('a+b-c')).to.equal('abc-+');
    expect(infixToPostfix('(a+b)-c')).to.equal('ab+c-');
    expect(infixToPostfix('l/m^n*o-p')).to.equal('lmn^/o*p-');
    expect(infixToPostfix('((l/(m^n))*o)-p')).to.equal('lmn^/o*p-');
    expect(infixToPostfix('((v/w)^x)*(y-z)')).to.equal('vw/x^yz-*');
  });
});

describe('Infix -> Postfix error handling', () => {
  it('should error on an invalid character', () => {
    const infixString = 'A';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Invalid character 'A'");
  });
  it('should error on mismatched closing parenthesis', () => {
    const infixString = 'a+b)-c';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Mismatched closing parenthesis");
  });
  it('should error on mismatched opening parenthesis', () => {
    const infixString = 'a+(b-c';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Mismatched open parenthesis");
  });
  it('should error on two adjacent operators', () => {
    const infixString = 'a+b+-c';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Operator '-' is in an invalid position");
  });
  it('should error on two adjacent operands', () => {
    const infixString = 'a+bc+d';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Operand 'c' is in an invalid position");
  });
  it('should error on operator at start of expression', () => {
    const infixString = '-a+c+d';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Operator '-' is in an invalid position");
  });
  it('should error on operator at end of expression', () => {
    const infixString = 'a+c+d-';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Operator '-' is in an invalid position");
  });
  it('should error on operator at start of parenthetical expression', () => {
    const infixString = 'e+f*(/a+c+d)';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Operator '/' is in an invalid position");
  });
  it('should error on operator at end of parenthetical expression', () => {
    const infixString = '(a+c+d-)+g';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Operator '-' is in an invalid position");
  });
  it('should error on operand preceding opening parenthesis', () => {
    const infixString = 'a+c(a+d)+g';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Opening parentheses cannot follow an operand");
  });
  it('should error on operand following closing parenthesis', () => {
    const infixString = 'a+(a+d)e+g';
    const func = infixToPostfix.bind(this, infixString);
    expect(func).to.throw(Error, "Operand 'e' is in an invalid position");
  });
});

describe('Postfix -> Infix converter', () => {
  it('should convert empty string to empty string', () => {
    const postfixString = '';
    expect(postfixToInfix(postfixString)).to.equal('');
  });
  it('should convert a single operand', () => {
    const postfixString = 'a';
    expect(postfixToInfix(postfixString)).to.equal('a');
  });
  it('should handle a single operator', () => {
    const postfixString = 'ab+';
    expect(postfixToInfix(postfixString)).to.equal('a+b');
  });
  it('should handle a chain of operators', () => {
    const postfixString = 'abc++';
    expect(postfixToInfix(postfixString)).to.equal('a+(b+c)');
  });
  it('should handle multiple groupings of operators', () => {
    const postfixString = 'abc/*de^f+-';
    expect(postfixToInfix(postfixString)).to.equal('(a*(b/c))-((d^e)+f)');
  });
  it('should handle provided example', () => {
    const postfixString = 'ag+ba-c+cedf^*+^*';
    expect(postfixToInfix(postfixString)).to.equal('(a+g)*(((b-a)+c)^(c+(e*(d^f))))');
  });
});

describe('Postfix -> Infix error handling', () => {
  it('should error on invalid character', () => {
    const postfixString = '(ab-cd*';
    const func = postfixToInfix.bind(this, postfixString);
    expect(func).to.throw(Error, "Invalid character '('");
  });
  it('should error on excess operands', () => {
    const postfixString = 'ab-cd*';
    const func = postfixToInfix.bind(this, postfixString);
    expect(func).to.throw(Error, "Not enough operators to consume all operands in postfix string");
  });
  it('should error on excess operators', () => {
    const postfixString = 'ab-+cd*';
    const func = postfixToInfix.bind(this, postfixString);
    expect(func).to.throw(Error, "Operator '+' does not have two operands to operate on");
  });
  it('should error on operator at beginning of expressions', () => {
    const postfixString = '*ab-cd*';
    const func = postfixToInfix.bind(this, postfixString);
    expect(func).to.throw(Error, "Operator '*' does not have two operands to operate on");
  });
});