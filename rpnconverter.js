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

  while (currentIndex < infixString.length && currentCharacter != ')') {
    if (isOperator(currentCharacter)) {
      while (shouldGroupLeft(currentCharacter, pendingOperators)) {
        postfixString += pendingOperators.pop();
      }

      pendingOperators.push(currentCharacter);
      currentIndex++;
    }
    else if (isOperand(currentCharacter)) {
      postfixString += currentCharacter;
      currentIndex++;
    }
    else if (currentCharacter === '(') {
      let substringStart = currentIndex + 1;
      let parenthesizedSubstring = infixString.slice(substringStart);

      parentheticalResult = infixToPostfix(parenthesizedSubstring);
      postfixString += parentheticalResult.postfixString;
      currentIndex += parentheticalResult.charactersParsed + 2;
    }
    else {
      throw new Error("Invalid character '" + currentCharacter + "' at index " + currentIndex);
    }

    currentCharacter = infixString.charAt(currentIndex);
  };

  while (pendingOperators.length) {
    postfixString += pendingOperators.pop();
  }

  return { 
    postfixString: postfixString,
    charactersParsed: currentIndex
  };
};

module.exports = {
  infixToPostfix: function (infixString) {
    return infixToPostfix(infixString).postfixString;
  }
};