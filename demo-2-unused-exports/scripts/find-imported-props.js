const esprima = require('esprima');
const fs = require('fs');
const customWalker = require('./custom-walker');

function findImportedProps(sourceCode) {
  const result = [];
  const tree = esprima.parse(sourceCode, { jsx: true });

  customWalker(tree, function (node) {
    if (node.type !== 'CallExpression') {
      return;
    }

    if (node.callee.type !== 'Identifier') {
      return;
    }

    if (node.callee.name !== 'require') {
      return;
    }

    if (node.arguments.length !== 1) {
      console.log(node);
      throw new Error("Not exactly one argument");
    }

    const arg = node.arguments[0];

    if (arg.type !== 'Literal' || typeof arg.value !== 'string') {
      console.log(node);
      throw new Error("Expected string literal - not found");
    }

    // Добавлено относительно unreachable-files.js
    if (!node.parent || node.parent.type !== 'MemberExpression') {
      return;
    }

    const memberExpession = node.parent;

    if (memberExpession.property.type !== 'Identifier') {
      console.log(node);
      throw new Error("Unexpected member with require with non-identifier property");
    }

    result.push({
      filename: arg.value,
      propName: memberExpession.property.name
    });
    // Конец добавления
  });

  return result;
}

const sourceCode = fs.readFileSync(__dirname + '/../src/App.js', 'utf-8');
console.log(findImportedProps(sourceCode));

module.exports = findImportedProps;
