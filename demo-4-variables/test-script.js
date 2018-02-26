const esprima = require('esprima');
const walk = require('./walk');
const escope = require('escope');

const source = `
import React from 'react';
import logo from './logo.svg';
import styles from './App.css';

module.exports = function () {
  return (
    <header className={styles['App-header']}>
      <img src={logo} className={styles['App-logo']} alt="logo" />
      <h1 className={styles['App-title']}>Welcome to React</h1>
    </header>
  );
};
`;

const ast = esprima.parseScript(source, { loc: true, jsx: true });
const scopeManager = escope.analyze(ast);

walk(ast, node => {
  if (node.type !== 'ImportDeclaration') {
    return;
  }

  if (node.source.value !== 'string') {
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

  console.log(node.specifiers[0].local.name);
  // const scope = scopeManager.acquire(node);
  // if (scope) {
  //   console.log(scope.variables.map(v => v.references))
  // }
})
