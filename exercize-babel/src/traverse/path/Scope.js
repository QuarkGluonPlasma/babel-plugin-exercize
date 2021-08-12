
class Binding {
    constructor(id, path, scope, kind) {
        this.id = id;
        this.path = path;
        this.referenced = false;
        this.referencePaths = [];
    }
}
class Scope {
    constructor(parentScope, path) {
        this.parent = parentScope;
        this.bindings = {};
        this.path = path;
           
        path.traverse({
            VariableDeclarator: (childPath) => {
                this.registerBinding(childPath.node.id.name, childPath);
            },
            FunctionDeclaration: (childPath) => {
                childPath.skip();
                this.registerBinding(childPath.node.id.name, childPath);
            }
        });

        path.traverse({
            Identifier: childPath =>  {
                if (!childPath.findParent(p => p.isVariableDeclarator() || p.isFunctionDeclaration())) {
                    const id = childPath.node.name;
                    const binding = this.getBinding(id);
                    if (binding) {
                        binding.referenced = true;
                        binding.referencePaths.push(childPath);
                    }
                }
            }
        });
    }

    registerBinding(id, path) {
        this.bindings[id] = new Binding(id, path);
    }

    getOwnBinding(id) {
        return this.bindings[id];
    }

    getBinding(id) {
        let res = this.getOwnBinding(id);
        if (res === undefined && this.parent) {
            res = this.parent.getOwnBinding(id);
        }
        return res;
    }

    hasBinding(id) {
        return !!this.getBinding(id);
    }
}

module.exports = Scope;
