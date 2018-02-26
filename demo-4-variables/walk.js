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
        potentialDescendantNode.parent = node;
        walkNode(potentialDescendantNode, callback);
      });
    } else if (typeof potentialChildNode === 'object' && potentialChildNode) {
      potentialChildNode.parent = node;
      walkNode(potentialChildNode, callback);
    }
  }
}

module.exports = walkNode;
