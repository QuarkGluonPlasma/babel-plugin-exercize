const { declare } = require('@babel/helper-plugin-utils');

function getAllClassMethodNames(classDeclarationNodePath) {
    const state = {
        allSuperMethodNames: []
    }
    classDeclarationNodePath.traverse({
        ClassMethod(path) {
            state.allSuperMethodNames.push(path.get('key').toString())
        }
    });
    return state.allSuperMethodNames;
}

const overrideCheckerPlugin = declare((api, options, dirname) => {
    api.assertVersion(7);

    return {
        pre(file) {
            file.set('errors', []);
        },
        visitor: {
            ClassDeclaration(path, state) {
                const semanticErrors = state.file.get('errors');

                const superClass = path.node.superClass;
                if (superClass) {
                    const superClassPath = path.scope.getBinding(superClass.name).path;
                    const allMethodNames = getAllClassMethodNames(superClassPath);
        
                    path.traverse({
                        ClassMethod(path) {
                            if (path.node.override){
                                const methodName = path.get('key').toString();
                                const superClassName = superClassPath.get('id').toString();
                                if (!allMethodNames.includes(methodName)) {
                                    const tmp = Error.stackTraceLimit;
                                    Error.stackTraceLimit = 0;
                                    let errorMessage = `this member cannot have an 'override' modifier because it is not declared in the base class '${superClassName}'`;
                                    semanticErrors.push(path.get('key').buildCodeFrameError(errorMessage, Error));
                                    Error.stackTraceLimit = tmp;                                    
                                }
                            }
                        }
                    });
                }
                state.file.set('errors', semanticErrors);
            }
        },
        post(file) {
            console.log(file.get('errors'));
        }
    }
});

module.exports = overrideCheckerPlugin;
