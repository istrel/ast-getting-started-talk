const esprima = require('esprima');
const nodeMetaKeys = ['loc', 'range', 'start', 'end', 'type', 'parent', 'fnScope', 'blockScope', 'expressionIdentifier', 'definitionIdentifier'];
const Syntax = esprima.Syntax;

let id = 0;

class DefinedName {
  constructor(name) {
    this.name = name;
    this.id = id++;
  }
}

// Extracts param names from pattern
// const [{ a: { b } = { c: d } } = e, [...f] = [...g], ...h] = i; -> ['b', 'f', 'h']
function parsePattern(pattern) {
  const result = [];

  switch (pattern.type) {
    case Syntax.Identifier:
      pattern.definitionIdentifier = true;
      result.push(pattern.name);
      break;
    case Syntax.ObjectPattern:
      pattern.properties.forEach(assignmentProperty => {
        result.push(...parsePattern(assignmentProperty.value));
      });
      break;
    case Syntax.RestElement:
      result.push(...parsePattern(pattern.argument));
      break;
    case Syntax.ArrayPattern:
      pattern.elements.forEach(patternOrNull => {
        if (patternOrNull === null) {
          return;
        }

        result.push(...parsePattern(patternOrNull));
      });
      break;
    case Syntax.AssignmentPattern:
      result.push(...parsePattern(pattern.left));
      break;
  }

  return result;
}

function wrap(node, parent) {
  node.parent = parent;
  node.blockScope = parent.blockScope;
  node.fnScope = parent.fnScope;

  function createFnScope() {
    node.fnScope = Object.create(parent.blockScope);
    node.blockScope = Object.create(node.fnScope);
  }

  function createBlockScope() {
    node.blockScope = Object.create(parent.blockScope);
  }

  function hoistFnName() {
    if (node.id !== null) {
      const fnName = node.id.name;

      parent.fnScope[fnName] = new DefinedName(fnName);
    }
  }

  function defineLocalFnName() {
    if (node.id !== null) {
      const fnName = node.id.name;

      node.fnScope[fnName] = new DefinedName(fnName);
    }
  }

  function defineVar(pattern) {
    parsePattern(pattern).forEach(name => {
      node.fnScope[name] = new DefinedName(name);
    });
  }

  function defineLetConst(pattern) {
    parsePattern(pattern).forEach(name => {
      node.blockScope[name] = new DefinedName(name);
    });
  }

  function defineParams() {
    node.params.forEach(param => {
      defineVar(param);
    });
  }

  function parseExpression(node) {
    if (node.type === Syntax.Identifier) {
      node.expressionIdentifier = true;
    }
  }

  switch (node.type) {
    // Эти блоки обрабатывают создание областей видимости и объявление новых переменных
    case Syntax.BlockStatement:
      createBlockScope()
      break;
    case Syntax.FunctionExpression:
      createFnScope();
      defineLocalFnName();
      defineParams();
      break;
    case Syntax.ClassExpression:
      createFnScope();
      defineLocalFnName();
      break;
    case Syntax.ArrowFunctionExpression:
      createFnScope();
      defineParams();
      break;
    case Syntax.FunctionDeclaration:
      createFnScope();
      hoistFnName();
      defineParams();
      break;
    case Syntax.ClassDeclaration:
      createFnScope();
      hoistFnName();
      break;
    case Syntax.ForStatement:
      createBlockScope();
      break;
    case Syntax.ImportSpecifier:
    case Syntax.ImportDefaultSpecifier:
    case Syntax.ImportNamespaceSpecifier:
      const idName = node.local.name;
      node.fnScope[idName] = new DefinedName(idName);
      break;
    case Syntax.CatchClause:
      createFnScope();
      defineVar(node.param);
      break;

    // Это блоки обрабатывают присваивания переменных
    case Syntax.VariableDeclarator:
      if (node.kind === 'var') {
        defineVar(node.id);
      } else {
        defineLetConst(node.id);
      }
      break;
    case Syntax.ForInStatement:
      // Если это не объявление переменной, то паттерн - найдем в нем все Identifier
      if (node.left.type !== Syntax.VariableDeclaration) {
        parsePattern(node.left);
      }
      break;
    case Syntax.AssignmentExpression:
      parsePattern(node.left);
      break;
  }

  // Единственная задача этих блоков - пометить идентификатор-выражение там, где оно есть
  switch (node.type) {
    case Syntax.ExpressionStatement:
      parseExpression(node.expression);
      break;
    case Syntax.WithStatement:
      parseExpression(node.object);
      break;
    case Syntax.ReturnStatement:
    case Syntax.ThrowStatement:
    case Syntax.UnaryExpression:
    case Syntax.UpdateExpression:
    case Syntax.SpreadElement:
    case Syntax.YieldExpression:
      parseExpression(node.argument);
      break;
    case Syntax.IfStatement:
    case Syntax.WhileStatement:
    case Syntax.DoWhileStatement:
    case Syntax.SwitchCase:
      parseExpression(node.test);
      break;
    case Syntax.SwitchStatement:
      parseExpression(node.discriminant);
      break;
    case Syntax.ForStatement:
      parseExpression(node.init);
      parseExpression(node.test);
      parseExpression(node.update);
      break;
    case Syntax.ForInStatement:
      parseExpression(node.right);
      break;
    case Syntax.VariableDeclarator:
      parseExpression(node.init);
      break;
    case Syntax.Property:
      if (node.computed) {
        parseExpression(node.key);
      }
      parseExpression(node.value);
      break;
    case Syntax.BinaryExpression:
    case Syntax.LogicalExpression:
      parseExpression(node.left);
      parseExpression(node.right);
      break;
    case Syntax.AssignmentExpression:
      // parseExpression(node.left); - no anymore in es2015
      parseExpression(node.right);
      break;
    case Syntax.MemberExpression:
      parseExpression(node.object);
      parseExpression(node.property);
      break;
    case Syntax.ConditionalExpression:
      parseExpression(node.test);
      parseExpression(node.alternate);
      parseExpression(node.consequent);
      break;
    case Syntax.CallExpression:
      parseExpression(node.callee);
      break;
    case Syntax.NewExpression:
      parseExpression(node.callee);
      node.arguments.forEach(parseExpression);
      break;
    case Syntax.ArrayExpression:
      node.elements.forEach(expressionOrNull => {
        if (expressionOrNull !== null) {
          parseExpression(expressionOrNull);
        }
      });
      break;
    case Syntax.CallExpression:
      node.arguments.forEach(parseExpression);
      break;
    case Syntax.SequenceExpression:
    case Syntax.TemplateLiteral:
      node.expressions.forEach(parseExpression);
      break;
    case Syntax.ArrowFunctionExpression:
      parseExpression(node.body);
      break;
    case Syntax.TaggedTemplateExpression:
      parseExpression(node.tag);
      break;
    case Syntax.AssignmentPattern:
      parseExpression(node.right);
      break;
    case Syntax.ClassDeclaration:
    case Syntax.ClassExpression:
      parseExpression(node.superClass);
      break;
    case Syntax.MethodDefinition:
      if (node.computed) {
        parseExpression(node.key);
      }
    case Syntax.ExportDefaultDeclaration:
      parseExpression(node.declaration);
      break;
    case Syntax.ExportSpecifier:
      parseExpression(node.exported);
      break;
  }

  return node;
}

function walkNode(node, callback) {
  if (!node.type) {
    return;
  }

  callback(node);

  for (const key in node) {
    if (nodeMetaKeys.indexOf(key) !== -1) {
      continue;
    }

    const potentialChildNode = node[key];

    if (Array.isArray(potentialChildNode)) {
      potentialChildNode.forEach(function (potentialDescendantNode) {
        walkNode(wrap(potentialDescendantNode, node), callback);
      });
    } else if (typeof potentialChildNode === 'object') {
      walkNode(wrap(potentialChildNode, node), callback);
    }
  }
}

function startWalkNode(node, callback) {
  node.fnScope = Object.create(null);
  node.blockScope = Object.create(node.fnScope);
  node.parent = null;

  walkNode(node, callback);
}

module.exports = startWalkNode;
