const findCssUsedClasses = require('./find-css-used-classes');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process')

const globalUsedClasses = {};

function collectCssInfo(filepath) {
  const sourceCode = fs.readFileSync(filepath, 'utf-8');
  const { found, usedClasses, cssPath } = findCssUsedClasses(sourceCode);

  if (!found) {
    return;
  }

  globalUsedClasses[cssPath] = globalUsedClasses[cssPath] || {};
  Object.assign(globalUsedClasses[cssPath], usedClasses);
}

// Cперва собираем статистику по использованным классам
child_process.execSync('git ls-files')
  .toString()
  .split('\n')
  .filter(function (file) {
    return file.match(/^src/) && file.match(/\.js$/);
  })
  .map(function (relative) { return path.resolve(relative); })
  .forEach(function (path) {
    collectCssInfo(path);
  });

// Потом собираем статистику по объявленным классам
console.log(globalUsedClasses);
