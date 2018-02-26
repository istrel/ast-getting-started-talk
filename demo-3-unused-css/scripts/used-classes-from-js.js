const isRequire = require('./is-require');
const customWalker = require('./custom-walker');
const findRequiredCSSPaths = require('./find-required-css-paths');
const fs = require('fs');
const esprima = require('esprima');

function findCssUsedClasses(sourceCode) {
  const declToPath = findRequiredCSSPaths(sourceCode);
  const foundStylesDeclarations = {};
  const tree = esprima.parse(sourceCode, { jsx: true });
  const declToClassToUsed = {};

  customWalker(tree, node => {
    if (node.type !== 'MemberExpression') {
      return;
    }

    const suggestedIdName = node.object.name

    if (node.object.type !== 'Identifier' || !(suggestedIdName in declToPath)) {
      return;
    }

    declToClassToUsed[suggestedIdName] = declToClassToUsed[suggestedIdName] || {};

    const memberExp = node;

    if (memberExp.computed) {
      if (memberExp.property.type === 'Literal') {
        declToClassToUsed[suggestedIdName][memberExp.property.value] = true;
      } else {
        console.log(memberExp.property);
        console.log('*');
        declToClassToUsed[suggestedIdName]['*'] = true;
      }
    } else {
      declToClassToUsed[suggestedIdName][memberExp.property.name] = true;
    }
  });

  return {declToClassToUsed, declToPath};
}

// const sourceCode = fs.readFileSync(__dirname + '/../src/App.js', 'utf-8');
// console.log(findCssUsedClasses(sourceCode));

module.exports = findCssUsedClasses;
