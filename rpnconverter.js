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

  let previousOperator = pendingOperators[pendingOperators.length-1];

  if (getPriority(previousOperator) >= getPriority(currentOperator)) {
    return true;
  }
};

function infixToPostfix(infixString) {
  let pendingOperators = [];
  let postfixString = '';

  for (let i = 0; i < infixString.length; ++i) {
    let char = infixString.charAt(i);

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
      let substringStart = i+1;
      let substringEnd = substringStart+1;
      while (infixString[substringEnd] != ')') {
        substringEnd++;
      }

      let infixSubString = infixString.slice(substringStart, substringEnd);
      i = substringEnd;
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