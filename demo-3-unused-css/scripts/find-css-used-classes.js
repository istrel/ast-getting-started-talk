const isRequire = require('./is-require');
const customWalker = require('./custom-walker');
const findCssPath = require('./find-css-path');
const fs = require('fs');
const esprima = require('esprima');

function findCssUsedClasses(sourceCode) {
  const cssPath = findCssPath(sourceCode);
  if (!cssPath) {
    return null;
  }

  const foundStylesDeclarations = {};
  const tree = esprima.parse(sourceCode, { jsx: true });
  const usedClasses = {};

  customWalker(tree, node => {
    if (node.type !== 'MemberExpression') {
      return;
    }

    if (node.object.type !== 'Identifier' || node.object.name !== 'styles') {
      return;
    }

    if (node.property.type === 'Identifier') {
      usedClasses[node.property.name] = true;
    } else if (node.property.type === 'Literal') {
      usedClasses[node.property.value] = true;
    } else {
      console.log(node);
      throw new Error('Unexpected usage of styles object');
    }
  });

  return usedClasses;
}

const sourceCode = fs.readFileSync(__dirname + '/../src/App.js', 'utf-8');
console.log(findCssUsedClasses(sourceCode));

module.exports = findCssUsedClasses;
