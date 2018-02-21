const nodeMetaKeys = ['loc', 'range', 'start', 'end', 'type', 'parent', 'fnScope', 'blockScope', 'expressionIdentifier', 'definitionIdentifier'];

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
        walkNode(potentialDescendantNode, callback);
      });
    } else if (typeof potentialChildNode === 'object') {
      walkNode(potentialChildNode, callback);
    }
  }
}

function startWalkNode(node, callback) {
  node.fnScope = Object.create(null);
  node.blockScope = Object.create(null);
  node.parent = null;

  walkNode(node, callback);
}

module.exports = startWalkNode;
