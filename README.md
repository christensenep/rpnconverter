RPN Converter
=============

A library to convert arithmetic expressions between infix and postfix notation.

Installation
------------

* Download the contents of this repository.
* Install the [Yarn](https://yarnpkg.com/) package manager.
* Type ```yarn``` from within the base directory of your local copy of the repository.

Testing
-------

* To execute tests, type ```yarn test```.

Derivation of the Infix to Postfix algorithm used
--------------------------------------------------

First, observe that a mathematically valid conversion of `a+b+c+d` is `abcd+++` (The requirements do not accept this, however. More on that later.) 
Similarly, `a+b*c^d` converts to `abcd^*+`. Thus, in the default case in which a prior operator does not take precedence over a later operator 
(that is, the expression is entirely left-associative), the conversion is simple: We output each operand in order, and then output each 
operator in reverse order. Our basic pattern will therefore be to proceed through the string, outputting each operand immediately, and putting 
each operator in a stack. Once the end of the string is reached, we output each operator in reverse order.

Now let's look at a case where a prior operator *does* take precedence over a later operator: `a*b+c`. This converts to `ab*c+`. The difference
here occurs once we reach the `+` in the infix string. Because the higher precedence of `*` demands that it occurs prior to the `+`, we need
to perform the `*` operation immediately, so that the section `a*b` will be consumed, to be later operated on by the `+` we've just encountered.
Thus, we insert the `*` at the top of our operator stack immediately, and then continue as normal: We put the `+` on top of the stack, and
continue. 

A more complex situation is: `a*b^c+d`. `*` does not precede `^`, so by the time we get to `+` we haven't had any interruptions in our default
pattern: That is, we've thus far outputted `abc` and our operator stack has `^` at the top, followed by `*`. However, now `+` is preceded by `^`,
so we have to pop out the `^`, effectively composing `(b^c)` into a single operand. The *new* prior operand is now `*`. Since this still takes priority
over `+`, we have to pop it as well, creating the composite operand `(a*(b^c))`. Finally, we reach `d`. Thus far, we've outputted `abc^*`, to 
which we add `d`, and finally the remaining contents of our operand stack, `+`, resulting in `abc^*d+`, the correct result.

All that remains is to handle parentheses. Since each parenthetical expression is a valid infix expression itself, we can handle this recursively.
When we reach an open parentheses, we perform our algorithm on the contents of this set of parentheses, insert the result at the end of our
converted string, and skip ahead to the end of the parentheses.

The final thing to note is that the requirements specify that equal operators should associate left rather than right. That is, `a+b+c+d` should
convert to `ab+c+d+`. This just means we need to break ties by assuming that the prior operator takes precedence over the current operator.

Thus, our algorithm is:

1. Set our current index to the start of the infix string
2. If the current index contains an operand, output it and increment the current index
3. If the current index contains an operator, and our operator stack is empty, or the current operator has higher precedence than the operator at the top of the stack, put the operator on top of the stack and increment the current index
4. Otherwise, pop the operator off the top of the stack and output it, then return to 3
5. If the current index contains an open parenthesis, perform this algorithm on the contents of the parentheses, output the result, and advance the current index to the end of the parentheses group
6. If the current index is the end of the string, or a closed parenthesis, pop operators off the top of our operator stack, outputting each in turn until the stack is empty.
7. Return the resuting output

Derivation of the Postfix to Infix algorithm used:
--------------------------------------------------

Fortunately, Postfix notation maps quite easily to familiar data structures: Each operand is pushed onto a stack, and each operator operates on the top
two entries in the operand stack, creating a new parenthetical expression, itself a new operand, which is then pushed to the operand stack. Unlike
with Infix notation, there's never a need to "look ahead" in the expression.

Our algorithm is simply:

1. Set our current index to the start of the postfix string
2. If the current index contains an operand, push it to the operand stack
3. If the current index contains an operator `o`, pop `y` and then `x` off the operand stack, and then push `(x o y)` to the operand stack.
4. Increment the current index.
5. If we have reached the end of the postfix string, pop the operand off the top of the operand stack and output it. Otherwise, return to 2.

For cosmetic reasons, we also strip the parentheses surrounding the final output, if they exist. This isn't strictly required, however.
