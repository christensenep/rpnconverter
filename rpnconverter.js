function isOperator(char) {
  let operatorRegex = /[-+/*^]/;
  return char.match(operatorRegex) !== null;
};

function infixToPostfix(infixString) {
  let operators = [];
  let postfixString = '';
  let operatorPrecedence = '+-*/^';

  for (let char of infixString) {
    if (isOperator(char)) {
      let lastOperator = operators[operators.length-1];
      while (lastOperator !== undefined && operatorPrecedence.indexOf(lastOperator) > operatorPrecedence.indexOf(char)) {
        postfixString += operators.pop();
        lastOperator = operators[operators.length-1];
      }
      
      operators.push(char);
    }
    else {
      postfixString += char;
    }
  };

  while (operators.length) {
    postfixString += operators.pop();
  }

  return postfixString;
};

module.exports = {
  infixToPostfix: infixToPostfix
};