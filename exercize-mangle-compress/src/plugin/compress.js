const { declare } = require('@babel/helper-plugin-utils');

function canExistAfterCompletion(path) {
    return path.isFunctionDeclaration() || path.isVariableDeclaration({
        kind: "var"
    });
}

const compress = declare((api, options, dirname) => {
    api.assertVersion(7);

    return {
        pre(file) {
            file.set('uid', 0);
        },
        visitor: {
            BlockStatement(path) {
                const statementPaths = path.get('body');
                let purge = false;
                for (let i = 0; i < statementPaths.length; i++) {

                    if (statementPaths[i].isCompletionStatement()) {
                        purge = true;
                        continue;
                    }

                    if (purge && !canExistAfterCompletion(statementPaths[i])) {
                        statementPaths[i].remove();
                    } 
                }
            },
            Scopable(path) {
                Object.entries(path.scope.bindings).forEach(([key, binding]) => {
                    if (!binding.referenced) {
                        if (binding.path.get('init').isCallExpression()) {
                            const comments = binding.path.get('init').node.leadingComments;
                            if(comments && comments[0]) {
                                if (comments[0].value.includes('PURE')) {
                                    binding.path.remove();
                                    return;
                                }
                            }
                        }
                        if (!path.scope.isPure(binding.path.node.init)) {
                            binding.path.parentPath.replaceWith(api.types.expressionStatement(binding.path.node.init));
                        } else {
                            binding.path.remove();
                        }
                    }
                });
            }
        }
    }
});

module.exports = compress;
