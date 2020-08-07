/*
Tree structure class.
Note: NOdes.ID must be unique for all tree nodes
 */
class Tree {
  constructor(root) {
    this._root = root || null;
  }

   _traverse(callback) {
    function goThrough(node) {
      callback(node);
      node.nodes.forEach((child) => {
        goThrough(child);
      });
    }
    goThrough(this._root);
  }


  _addNode(id, text, img, parentNodeId, objData, fileImg ) {
    const newNode = {
      id: id,
      text: text,
      img: img,
      objData: objData,
      fileImg: fileImg,
      nodes: []
    };

    if (this._root === null) {
      this._root = newNode;
      return;
    }

    this._traverse((node) => {
        if (node.id === parentNodeId) {
          if (this._search(newNode.id) === 'Not Found') {
              node.nodes.push(newNode);
          }
        }
    });
  }

  _removeNode(id) {
    this._traverse((node) => {
      node.nodes.forEach((childNode, index) => {
        if (childNode.id === id) {
          node.nodes.splice(index, 1);
        }
      });
    })
  }

  _search(id) {
    let returnNode = 'Not Found';
    this._traverse((node) => {
      if (node.id === id) {
        returnNode = node;
      }
    });
    return returnNode;
  }

  _displayLeafs(parentNodeId) {
    const parentNode = typeof parentNodeId === 'string' ? this._search(parentNodeId) : parentNodeId ;
    let leafsRet = [];
    if (parentNodeId.nodes && !parentNodeId.nodes.length) {
      return parentNodeId;
    }

      parentNode.nodes.forEach((child) => {
      leafsRet.push(this._displayLeafs(child));
    });

    return leafsRet.flat();
  }

}

class Node {
  constructor(id, children) {
    this.id = id;
    this.nodes = children;
  }
}

module.exports = Tree;

