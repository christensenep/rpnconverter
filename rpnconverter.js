function isOperator(char) {
  let operatorRegex = /[-+/*^]/;
  return char.match(operatorRegex) !== null;
};

function infixToPostfix(infixString) {
  let operators = [];
  let postfixString = '';

  for (let char of infixString) {
    if (isOperator(char)) {
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