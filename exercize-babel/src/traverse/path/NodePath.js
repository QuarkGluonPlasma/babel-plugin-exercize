module.exports = class NodePath {
    constructor(node, parent, parentPath, key, listKey) {
        this.node = node;
        this.parent = parent;
        this.parentPath = parentPath;
        this.key = key;
        this.listKey = listKey;
    }
    replaceWith(node) {
        if (this.listKey) {
            this.parent[this.key].splice(this.listKey, 1, node);
        }
        this.parent[this.key] = node
    }
    remove () {
        if (this.listKey) {
            this.parent[this.key].splice(this.listKey, 1);
        }
        this.parent[this.key] = null;
    }
}
