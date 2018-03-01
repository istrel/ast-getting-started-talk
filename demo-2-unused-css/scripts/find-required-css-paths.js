const isRequire = require('./is-require');
const customWalker = require('./custom-walker');
const esprima = require('esprima');

function findRequiredCSSPaths(sourceCode) {
  const nameToPathMap = {};
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

    nameToPathMap[node.parent.id.name] = requiredPath;
  });

  return nameToPathMap;
}

module.exports = findRequiredCSSPaths;
