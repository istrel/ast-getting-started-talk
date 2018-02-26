const isRequire = require('./is-require');
const customWalker = require('./custom-walker');
const findRequiredCSSPaths = require('./find-required-css-paths');
const fs = require('fs');
const esprima = require('esprima');
const escope = require('escope');

function findCssUsedClasses(sourceCode) {
  const declToPath = findRequiredCSSPaths(sourceCode);
  const foundStylesDeclarations = {};
  const tree = esprima.parse(sourceCode, { jsx: true });

  const scopeManager = escope.analyze(tree, { ecmaVersion: 6 });

  // CommonJS case
  const moduleScope = scopeManager.acquire(tree);

  // ES6 modules Case
  // const globalScope = scopeManager.acquire(tree);
  // const [moduleScope] = globalScope.childScopes;

  const declToClassToUsed = {};

  moduleScope.variables.forEach(v => {
    if (declToClassToUsed[v.name]) {
      const { references } = v;

      references.forEach(ref => {
        const identifierParent = ref.identifier.parent;

        if (identifierParent.type !== 'MemberExpression' || identifierParent.object !== ref.identifier) {
          console.log(identifierParent);
          console.log(ref.identifier);
          throw new Error('Not expected usage');
        }

        const memberExp = identifierParent;

        if (memberExp.computed) {
          if (memberExp.property.type === 'Literal') {
            declToClassToUsed[v.name][memberExp.property.value] = true;
          } else {
            console.log(memberExp.property);
            console.log('*');
            declToClassToUsed[v.name]['*'] = true;
          }
        } else {
          declToClassToUsed[v.name][memberExp.property.name] = true;
        }
      });
    }
  })


  return { declToClassToUsed, declToPath };
}

// const sourceCode = fs.readFileSync(__dirname + '/../src/App.js', 'utf-8');
// console.log(findCssUsedClasses(sourceCode));

module.exports = findCssUsedClasses;
