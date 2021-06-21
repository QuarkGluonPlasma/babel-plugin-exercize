const { declare } = require('@babel/helper-plugin-utils');

function typeEval(node, params) {
    let checkType;
    if(node.checkType.type === 'TSTypeReference') {
        checkType = params[node.checkType.typeName.name];
    } else {
        checkType = resolveType(node.checkType);
    }
    const extendsType = resolveType(node.extendsType);
    if (checkType === extendsType || checkType instanceof extendsType) {
        return resolveType(node.trueType);
    } else {
        return resolveType(node.falseType);
    }
}

function resolveType(targetType, referenceTypesMap = {}, scope) {
    const tsTypeAnnotationMap = {
        TSStringKeyword: 'string',
        TSNumberKeyword: 'number'
    }
    switch (targetType.type) {
        case 'TSTypeAnnotation':
            if (targetType.typeAnnotation.type === 'TSTypeReference') {
                return referenceTypesMap[targetType.typeAnnotation.typeName.name]
            }
            return tsTypeAnnotationMap[targetType.typeAnnotation.type];
        case 'NumberTypeAnnotation': 
            return 'number';
        case 'StringTypeAnnotation':
            return 'string';
        case 'TSNumberKeyword':
            return 'number';
        case 'TSTypeReference':
            const typeAlias = scope.getData(targetType.typeName.name);
            const paramTypes = targetType.typeParameters.params.map(item => {
                return resolveType(item);
            });
            const params = typeAlias.paramNames.reduce((obj, name, index) => {
                obj[name] = paramTypes[index]; 
                return obj;
            },{});
            return typeEval(typeAlias.body, params);
        case 'TSLiteralType':
            return targetType.literal.value;
    }
}

function noStackTraceWrapper(cb) {
    const tmp = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    cb && cb(Error);
    Error.stackTraceLimit = tmp;
}

const noFuncAssignLint = declare((api, options, dirname) => {
    api.assertVersion(7);

    return {
        pre(file) {
            file.set('errors', []);
        },
        visitor: {
            TSTypeAliasDeclaration(path) {
                path.scope.setData(path.get('id').toString(), {
                    paramNames: path.node.typeParameters.params.map(item => {
                        return item.name;
                    }),
                    body: path.getTypeAnnotation()
                });
                path.scope.setData(path.get('params'))
            },
            CallExpression(path, state) {
                const errors = state.file.get('errors');
                const realTypes = path.node.typeParameters.params.map(item => {
                    return resolveType(item, {}, path.scope);
                });
                const argumentsTypes = path.get('arguments').map(item => {
                    return resolveType(item.getTypeAnnotation());
                });
                const calleeName = path.get('callee').toString();
                const functionDeclarePath = path.scope.getBinding(calleeName).path;
                const realTypeMap = {};
                functionDeclarePath.node.typeParameters.params.map((item, index) => {
                    realTypeMap[item.name] = realTypes[index];
                });
                const declareParamsTypes = functionDeclarePath.get('params').map(item => {
                    return resolveType(item.getTypeAnnotation(), realTypeMap);
                })

                argumentsTypes.forEach((item, index) => {
                    if (item !== declareParamsTypes[index]) {
                        noStackTraceWrapper(Error => {
                            errors.push(path.get('arguments.' + index ).buildCodeFrameError(`${item} can not assign to ${declareParamsTypes[index]}`,Error));
                        });
                    }
                });
            }
        },
        post(file) {
            console.log(file.get('errors'));
        }
    }
});

module.exports = noFuncAssignLint;
