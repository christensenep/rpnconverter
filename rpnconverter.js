function isOperator(char) {
  let operatorRegex = /[-+/*^]/;
  return char.match(operatorRegex) !== null;
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

function closingParenthesisIndex(string, openingParenthesisIndex) {
  let currentIndex = openingParenthesisIndex + 1;
  while (string[currentIndex] != ')') {
    currentIndex++;
  }

  return currentIndex;
}

function infixToPostfix(infixString) {
  let pendingOperators = [];
  let postfixString = '';

  for (let currentIndex = 0; currentIndex < infixString.length; ++currentIndex) {
    let char = infixString.charAt(currentIndex);

    if (char === ')') {
      break;
    }

    if (isOperator(char)) {
      while (shouldGroupLeft(char, pendingOperators)) {
        postfixString += pendingOperators.pop();
      }

      pendingOperators.push(char);
    }
    else if (char === '(') {
      let substringStart = currentIndex + 1;
      let substringEnd = closingParenthesisIndex(infixString, currentIndex);

      let infixSubString = infixString.slice(substringStart, substringEnd);
      currentIndex = substringEnd;
      postfixString += infixToPostfix(infixSubString);
    }
    else {
      postfixString += char;
    }
  };

  while (pendingOperators.length) {
    postfixString += pendingOperators.pop();
  }

  return postfixString;
};

module.exports = {
  infixToPostfix: infixToPostfix
};