const esprima = require('esprima');
const walk = require('./walk');
const escope = require('escope');

const source = `
import React from 'react';
import logo from './logo.svg';
import styles from './App.css';

function hello(styles) {
  styles.forEach(console.log.bind(console));
}

module.exports = function () {
  console.log(styles.hello);
  return (
    <header className={styles['App-header']}>
      <img src={logo} className={styles['App-logo']} alt="logo" />
      <h1 className={styles['App-title']}>Welcome to React</h1>
    </header>
  );
};
`;

const ast = esprima.parseModule(source, { loc: true, jsx: true });
const scopeManager = escope.analyze(ast, {ecmaVersion: 6, sourceType: 'module'});

const importedNames = {};

walk(ast, node => {
  if (node.type !== 'ImportDeclaration') {
    return;
  }

  if (typeof node.source.value !== 'string') {
    throw new Error('Import path not string')
  }

  if (!node.source.value.match(/\.css$/)) {
    return;
  }

  if (node.specifiers.length !== 1) {
    throw new Error('Expected only one import from css');
  }

  if (node.specifiers[0].type !== 'ImportDefaultSpecifier') {
    throw new Error('Expected default import from css');
  }

  importedNames[node.specifiers[0].local.name] = {};
})

const globalScope = scopeManager.acquire(ast);
const [moduleScope] = globalScope.childScopes;

moduleScope.variables.forEach(v => {
  if (importedNames[v.name]) {
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
          importedNames[v.name][memberExp.property.value] = true;
        } else {
          console.log(memberExp.property);
          console.log('*');
          importedNames[v.name]['*'] = true;
        }
      } else {
        importedNames[v.name][memberExp.property.name] = true;
      }
    });
  }
})

console.log(importedNames);