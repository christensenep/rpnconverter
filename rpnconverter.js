'use strict';

function infixToPostfix(infixString) {
  const pendingOperators = [];
  let postfixString = '';
  let currentIndex = 0;
  let currentCharacter = infixString.charAt(currentIndex);
  let currentCharacterShouldBeOperator = false;

  while (currentIndex < infixString.length && currentCharacter !== ')') {
    if (isOperator(currentCharacter)) {
      if (!currentCharacterShouldBeOperator) {
        throw new Error("Operator '" + currentCharacter + "' is in an invalid position");
      }

      while (shouldGroupLeft(currentCharacter, pendingOperators)) {
        postfixString += pendingOperators.pop();
      }

      pendingOperators.push(currentCharacter);
      currentIndex++;
    } 
    else if (isOperand(currentCharacter)) {
      if (currentCharacterShouldBeOperator) {
        throw new Error("Operand '" + currentCharacter + "' is in an invalid position");
      }

      postfixString += currentCharacter;
      currentIndex++;
    }
    else if (currentCharacter === '(') {
      if (currentCharacterShouldBeOperator) {
        throw new Error("Opening parentheses cannot follow an operand");
      }

      const substringStart = currentIndex + 1;
      const parenthesizedSubstring = infixString.slice(substringStart);

      const parentheticalResult = infixToPostfix(parenthesizedSubstring);
      postfixString += parentheticalResult.postfixString;
      currentIndex += parentheticalResult.charactersParsed + 2;
      if (currentIndex > infixString.length) {
        throw new Error("Mismatched open parenthesis");
      }
    }
    else {
      throw new Error("Invalid character '" + currentCharacter + "'");
    }

    currentCharacter = infixString.charAt(currentIndex);
    currentCharacterShouldBeOperator = !currentCharacterShouldBeOperator;
  };

  const lastCharacterParsed = infixString.charAt(currentIndex-1);
  if (isOperator(lastCharacterParsed)) {
    throw new Error("Operator '" + lastCharacterParsed + "' is in an invalid position");
  }

  while (pendingOperators.length) {
    postfixString += pendingOperators.pop();
  }

  return { 
    postfixString: postfixString,
    charactersParsed: currentIndex
  };
};

function postfixToInfix(postfixString) {
  const operandStack = [];

  for (const currentCharacter of postfixString) {
    if (isOperand(currentCharacter)) {
      operandStack.push(currentCharacter);
    }
    else if (isOperator(currentCharacter)) {
      if (operandStack.length < 2) {
        throw new Error("Operator '" + currentCharacter + "' does not have two operands to operate on");
      }

      let composedOperand = currentCharacter + operandStack.pop() + ')';
      composedOperand = '(' + operandStack.pop() + composedOperand;
      operandStack.push(composedOperand);
    }
    else {
      throw new Error("Invalid character '" + currentCharacter + "'");
    }
  }

  if (operandStack.length > 1) {
    throw new Error("Not enough operators to consume all operands in postfix string");
  }

  if (operandStack.length === 0) {
    return '';
  }

  let infixString = operandStack.pop();
  if (infixString.charAt(0) === '(') {
    infixString = infixString.slice(1,-1);
  }

  return infixString;
};

function isOperator(char) {
  const operatorRegex = /[-+/*^]/;
  return char.match(operatorRegex) !== null;
};

function isOperand(char) {
  const operandRegex = /[a-z]/;
  return char.match(operandRegex) !== null;
};

function getPriority(operator) {
  const operatorPrecedence = '+-*/^';
  return operatorPrecedence.indexOf(operator);
}

function shouldGroupLeft(currentOperator, pendingOperators) {
  if (pendingOperators.length === 0) {
    return false;
  }

  const previousOperator = pendingOperators[pendingOperators.length - 1];

  if (getPriority(previousOperator) >= getPriority(currentOperator)) {
    return true;
  }
};

module.exports = {
  infixToPostfix: function (infixString) {
    const parseResult = infixToPostfix(infixString);
    if (parseResult.charactersParsed !== infixString.length) {
      throw new Error("Mismatched closing parenthesis");
    };
    return parseResult.postfixString;
  },

  postfixToInfix: postfixToInfix
};