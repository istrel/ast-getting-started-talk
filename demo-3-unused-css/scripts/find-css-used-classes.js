const esprima = require('esrpima');
const customWalker = require('./custom-walker');

function findCssUsedClasses(sourceCode) {

}

const cssImportName = foundCssImports[cssFilePath];
const usedClasses = {};

walk(jsAst.ast, node => {
  if (node.type === 'Identifier' && node.name === cssImportName) {
    const parent = node.parent;

    if (parent.type === 'ImportDefaultSpecifier') {
      return;
    }

    if (parent.type !== 'MemberExpression') {
      throw new Error('Not member');
    }

    const property = parent.property;

    // styles['hello']
    if (parent.computed) {
      if (property.type !== 'Literal') {
        throw new Error('Not literal');
      }

      usedClasses[property.value] = true;
    } else {
      if (property.type !== 'Identifier') {
        throw new Error('Unexpected identifier');
      }

      usedClasses[property.name] = true;
    }
  }
});
