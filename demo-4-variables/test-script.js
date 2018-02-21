const esprima = require('esprima');
const findVariables = require('./find-variables');
const walk = require('./walk');

const source = `
const [ e, ...{a = { b = c } } ] = d;

const c = 'c';
const [{ b: { c } = { d: d } } = 5, [...z] = [...y], ...x] = d;
const [] = d;

function hello(world) { }

function wat({wat: {wat = wat}} = {wat}) {
  const wat = wat;

  for(let wat = 0; wat < 3; wat++) {

  }
}
`;

const ast = esprima.parseScript(source, { loc: true });

findVariables(ast, () => null);
walk(ast, node => {
  console.log(node.blockScope);
})
