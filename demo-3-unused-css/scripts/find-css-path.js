const isRequire = require('./is-require');
const customWalker = require('./custom-walker');
const fs = require('fs');
const esprima = require('esprima');

function findCssPath(sourceCode) {
  const foundStylesDeclarations = {};
  const tree = esprima.parse(sourceCode, { jsx: true });
  let foundCssPath = null;

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

    if (node.parent.id.name !== 'styles') {
      console.log(node.parent);
      throw new Error('Only styles name allowed for css');
    }

    foundCssPath = requiredPath;
  });

  return foundCssPath;
}

// const sourceCode = fs.readFileSync(__dirname + '/../src/App.js', 'utf-8');
// console.log(findCssPath(sourceCode));

module.exports = findCssPath;
