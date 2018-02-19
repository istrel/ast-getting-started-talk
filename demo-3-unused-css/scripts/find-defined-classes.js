const csstree = require('css-tree');
const fs = require('fs');

function definedClasses(cssSource) {
  const foundClassNames = {};
  const cssAst = csstree.parse(cssSource);

  csstree.walk(cssAst, function (node) {
    if (node.type === 'ClassSelector') {
      foundClassNames[node.name] = true;
    }
  });

  return foundClassNames;
}

// const sourceCode = fs.readFileSync(__dirname + '/../src/App.css', 'utf-8');
// console.log(definedClasses(sourceCode));

module.exports = definedClasses;
