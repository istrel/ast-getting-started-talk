const nodeMetaKeys = ['loc', 'range', 'start', 'end', 'type', 'parent'];

function walkNode(node, callback) {
  // Проверяем, что находимся внутри
  if (!node.type) {
    return;
  }

  callback(node);

  for (const key in node) {
    // Отбрасываем ключи, которые заведомо не являются нодами
    if (nodeMetaKeys.indexOf(key) !== -1) {
      continue;
    }

    const potentialChildNode = node[key];

    if (Array.isArray(potentialChildNode)) {
      // Если это массив нод - вызываем итератор для каждого ребенка, передав туда parent
      potentialChildNode.forEach(function (potentialDescendantNode) {
        Object.defineProperty(potentialDescendantNode, 'parent', { value: node, enumerable: false });
        walkNode(potentialDescendantNode, callback);
      });
    } else if (typeof potentialChildNode === 'object' && potentialChildNode) {
      // Если же это объект (предположительно - нода) - вызываем итератор для самого объекта
      Object.defineProperty(potentialChildNode, 'parent', { value: node, enumerable: false });
      walkNode(potentialChildNode, callback);
    }
  }
}

module.exports = walkNode;
