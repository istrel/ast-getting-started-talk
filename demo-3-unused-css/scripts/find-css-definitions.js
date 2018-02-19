const isRequire = require('./is-require');
const customWalker = require('./custom-walker');
const fs = require('fs');
const esprima = require('esprima');

function findCssDefinitions(sourceCode) {
  const foundStylesDeclarations = {};
  const tree = esprima.parse(sourceCode, { jsx: true });

  customWalker(tree, node => {
    const requiredPath = isRequire(node);

    if (!requiredPath) {
      return;
    }

    if (!requiredPath.match(/\.css$/)) {
      return;
    }

    if (!node.parent || node.parent.type !== 'VariableDeclarator') {
      console.log(node);
      throw new Error('Requiring styles not inside variable declarator');
    }

    foundStylesDeclarations[node.parent.id.name] = requiredPath;

    return foundStylesDeclarations
  });

  if (Object.keys(foundStylesDeclarations).length) {
    return foundStylesDeclarations;
  } else {
    return null;
  }
}

const sourceCode = fs.readFileSync(__dirname + '/../src/App.js', 'utf-8');
console.log(findCssDefinitions(sourceCode));

module.exports = findCssDefinitions;
