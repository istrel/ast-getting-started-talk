function isRequire(node) {
  if (node.type !== 'CallExpression') {
    return null;
  }

  if (node.callee.type !== 'Identifier') {
    return null;
  }

  if (node.callee.name !== 'require') {
    return null;
  }

  if (node.arguments.length !== 1) {
    console.log(node);
    throw new Error("Not exactly one argument");
  }

  const arg = node.arguments[0];

  if (arg.type !== 'Literal' || typeof arg.value !== 'string') {
    console.log(node);
    throw new Error("Expected string literal - not found");
  }

  return arg.value;
}

module.exports = isRequire;
