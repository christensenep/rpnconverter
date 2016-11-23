function isOperator(char) {
  let operatorRegex = /[-+/*^]/;
  return char.match(operatorRegex) !== null;
};

function isOperand(char) {
  let operandRegex = /[a-z]/;
  return char.match(operandRegex) !== null;
};

function getPriority(operator) {
  let operatorPrecedence = '+-*/^';
  return operatorPrecedence.indexOf(operator);
}

function shouldGroupLeft(currentOperator, pendingOperators) {
  if (pendingOperators.length === 0) {
    return false;
  }

  let previousOperator = pendingOperators[pendingOperators.length - 1];

  if (getPriority(previousOperator) >= getPriority(currentOperator)) {
    return true;
  }
};

function infixToPostfix(infixString) {
  let pendingOperators = [];
  let postfixString = '';
  let currentIndex = 0;
  let currentCharacter = infixString.charAt(currentIndex);
  let currentCharacterShouldBeOperator = false;

  while (currentIndex < infixString.length && currentCharacter != ')') {
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

      let substringStart = currentIndex + 1;
      let parenthesizedSubstring = infixString.slice(substringStart);

      parentheticalResult = infixToPostfix(parenthesizedSubstring);
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

  let lastCharacterParsed = infixString.charAt(currentIndex-1);
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
  let operandStack = [];

  for (let currentCharacter of postfixString) {
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

  let infixString = operandStack.pop();
  if (infixString.charAt(0) === '(') {
    infixString = infixString.slice(1,-1);
  }

  return infixString
};

module.exports = {
  infixToPostfix: function (infixString) {
    let parseResult = infixToPostfix(infixString);
    if (parseResult.charactersParsed !== infixString.length) {
      throw new Error("Mismatched closing parenthesis");
    };
    return infixToPostfix(infixString).postfixString;
  },

  postfixToInfix: postfixToInfix
};