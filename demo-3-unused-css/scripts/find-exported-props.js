const esprima = require('esprima');
const fs = require('fs');

function isModuleExports(node) {
  if (node.type !== 'MemberExpression') {
    return false;
  }

  if (node.object.type !== 'Identifier') {
    return false;
  }
  if (node.object.name !== 'module') {
    return false;
  }

  if (node.property.type !== 'Identifier') {
    return false
  }
  if (node.property.name !== 'exports') {
    return false
  }

  return true;
}

function findExportedProps(sourceCode) {
  const result = [];
  esprima.parse(sourceCode, { jsx: true }, function (node) {
    if (node.type !== 'AssignmentExpression') {
      return;
    }

    if (!isModuleExports(node.left)) {
      return;
    }

    if (node.right.type !== 'ObjectExpression') {
      return;
    }

    const obj = node.right;

    obj.properties.forEach(function (prop) {
      if (prop.key.type !== 'Identifier') {
        console.log(prop);
        throw new Error('Prop not identifier');
      }

      if (prop.key.computed) {
        console.log(prop);
        throw new Error('No support for computed props');
      }

      result.push(prop.key.name);
    });
  });

  return result;
}

// const sourceCode = fs.readFileSync(__dirname + '/../src/utils.js', 'utf-8');
// console.log(findExportedProps(sourceCode));

module.exports = findExportedProps;
