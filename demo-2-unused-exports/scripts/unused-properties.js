const fs = require('fs');
const path = require('path');
const findImportedProps = require('./find-imported-props');
const findExportedProps = require('./find-exported-props');

const visited = {};

const queue = [path.resolve(__dirname, '../src/index.js')];

const exportedProperties = {};
const usedProperties = {};

function markUsedProperty(path, propName) {
  usedProperties[path] = usedProperties[path] || {};
  usedProperties[path][propName] = true;
}

while (queue.length) {
  const next = queue.shift();

  visited[next] = true;

  const sourceCode = fs.readFileSync(next, 'utf-8');
  const sourceDir = path.dirname(next);
  const requires = findImportedProps(sourceCode);
  const exportedProps = findExportedProps(sourceCode);

  exportedProperties[next] = {};
  exportedProps.forEach(function (propName) {
    exportedProperties[next][propName] = true;
  });

  requires.forEach(function ({ filename, propName }) {
    if (filename[0] !== '.') {
      return;
    }

    const extname = path.extname(filename);

    if (extname !== '.js' && extname !== '') {
      return;
    }

    if (extname === '') {
      filename = filename + '.js';
    }

    const absolutePathToRequiredFile = path.resolve(sourceDir, filename);

    queue.push(absolutePathToRequiredFile);

    if (propName) {
      markUsedProperty(absolutePathToRequiredFile, propName);
    }
  });
}

console.log('Used properties: ');
console.log(usedProperties);

console.log(`
=======================================
`);

console.log('Exported properties: ');
console.log(exportedProperties);

console.log(`
=======================================
`);

for (const filename in exportedProperties) {
  for (const propName in exportedProperties[filename]) {
    if (!usedProperties[filename][propName]) {
      console.log(`Unused property '${propName}' in file '${filename}'`)
    }
  }
}
