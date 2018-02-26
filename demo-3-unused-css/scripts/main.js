const usedClassesFromJS = require('./used-classes-from-js');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process')

const globalUsedClasses = {};

function gatherUsedCSSClasses(filepath) {
  const sourceCode = fs.readFileSync(filepath, 'utf-8');
  const dirname = path.dirname(filepath);
  const {declToClassToUsed, declToPath} = usedClassesFromJS(sourceCode);

  for (const declName in declToPath) {
    const cssPath = path.resolve(dirname, declToPath[declName]);
    globalUsedClasses[cssPath] = globalUsedClasses[cssPath] || {};
    const usedClasses = declToClassToUsed[declName];

    for (const usedClassName in usedClasses) {
      globalUsedClasses[cssPath][usedClassName] = true;
    }
  }
}

function gatherDefinedCSSClasses(filepath) {

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
    gatherUsedCSSClasses(path);
  });

// Потом собираем статистику по объявленным классам
console.log(globalUsedClasses);
