const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const findRequires = require('./find-requires');

const visited = {};

const queue = [path.resolve(__dirname, '../src/index.js')];

while (queue.length) {
  const next = queue.shift();

  visited[next] = true;

  const sourceCode = fs.readFileSync(next, 'utf-8');
  const sourceDir = path.dirname(next);
  const requires = findRequires(sourceCode);

  console.log(`Requires found in ${next}: ${requires.join(', ')}`);

  requires.forEach(function (relativeRequire) {
    if (relativeRequire[0] !== '.') {
      return;
    }

    const extname = path.extname(relativeRequire);

    if (extname !== '.js' && extname !== '') {
      return;
    }

    if (extname === '') {
      relativeRequire = relativeRequire + '.js';
    }

    const absolutePathToRequiredFile = path.resolve(sourceDir, relativeRequire);

    queue.push(absolutePathToRequiredFile);

    return absolutePathToRequiredFile;
  });
}

console.log(`
=======================================
`);

child_process.execSync('git ls-files')
  .toString()
  .split('\n')
  .filter(function (file) {
    return file.match(/\.js$/);
  })
  .map(function (relative) { return path.resolve(relative); })
  .filter(Boolean)
  .forEach(function (path) {
    if (!visited[path]) {
      console.log(`Not required: ${path}`);
    }
  });
