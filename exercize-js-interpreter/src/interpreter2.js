const  parser = require('@babel/parser');
const { codeFrameColumns } = require('@babel/code-frame');
const chalk = require('chalk');

const sourceCode = `
   const  a = 2;
   function add(a, b) {
    return a + b;
   }
   console.log(add(1, 2));
`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous'
});

class Scope {
    constructor(parentScope) {
        this.parent = parentScope;
        this.declarations = [];
    }

    set(name, value) {
        this.declarations[name] = value;
    }

    getLocal(name) {
        return this.declarations[name];
    }

    get(name) {
        let res = this.getLocal(name);
        if (res === undefined && this.parent) {
            res = this.parent.get(name);
        }
        return res;
    }

    has(name) {
        return !!this.getLocal(name);
    }
}

function getIdentifierValue(node, scope) {
    if (node.type === 'Identifier') {
        return scope.get(node.name);
    } else {
        return evaluate(node, scope);
    }
}

const evaluator = (function() {

    const astInterpreters = {
        Program (node, scope) {
            node.body.forEach(item => {
                evaluate(item, scope);
            })
        },
        VariableDeclaration(node, scope) {
            node.declarations.forEach((item) => {
                evaluate(item, scope);
            });
        },
        VariableDeclarator(node, scope) {
            const declareName = evaluate(node.id);
            if (scope.get(declareName)) {
                throw Error('duplicate declare variable：' + declareName);
            } else {
                scope.set(declareName, evaluate(node.init, scope));
            }
        },
        ExpressionStatement(node, scope) {
            return evaluate(node.expression, scope);
        },
        MemberExpression(node, scope) {
            const obj = scope.get(evaluate(node.object));
            return obj[evaluate(node.property)]
        },
        FunctionDeclaration(node, scope) {
            const declareName = evaluate(node.id);
            if (scope.get(declareName)) {
                throw Error('duplicate declare variable：' + declareName);
            } else {
                scope.set(declareName, function(...args) {
                    const funcScope = new Scope();
                    funcScope.parent = scope;

                    node.params.forEach((item, index) => {
                        funcScope.set(item.name, args[index]);
                    });
                    funcScope.set('this', this);
                    return evaluate(node.body, funcScope);
                });
            }
        },
        ReturnStatement(node, scope) {
            return evaluate(node.argument, scope);
        },
        BlockStatement(node, scope) {
            for (let i = 0; i< node.body.length; i++) {
                if (node.body[i].type === 'ReturnStatement') {
                    return evaluate(node.body[i], scope);
                }
                evaluate(node.body[i], scope);
            }
        },
        CallExpression(node, scope) {
            const args = node.arguments.map(item => {
                if (item.type === 'Identifier') {
                    return scope.get(item.name);
                }
                return evaluate(item, scope);
            });
            if(node.callee.type === 'MemberExpression') {
                const fn = evaluate(node.callee, scope);
                const obj = evaluate(node.callee.object, scope);
                return fn.apply(obj, args);
            } else {
                const fn = scope.get(evaluate(node.callee, scope));
                return fn.apply(null, args);
            }
        },
        BinaryExpression(node, scope) {
            const leftValue = getIdentifierValue(node.left, scope);
            const rightValue = getIdentifierValue(node.right, scope);;
            switch(node.operator) {
                case '+':
                    return leftValue + rightValue;
                case '-':
                    return leftValue - rightValue;
                case '*':
                    return leftValue * rightValue;
                case '/':
                    return leftValue / rightValue;
                default: 
                    throw Error('upsupported operator：' + node.operator);
            }
        },
        Identifier(node, scope) {
            return node.name;
        },
        NumericLiteral(node, scope) {
            return node.value;
        }
    }

    const evaluate = (node, scope) => {
        try {
            return astInterpreters[node.type](node, scope);
        } catch(e) {
            if (e && e.message && e.message.indexOf('astInterpreters[node.type] is not a function') != -1) {
                console.error('unsupported ast type: ' + node.type);
                console.error(codeFrameColumns(sourceCode, node.loc, {
                    highlightCode: true
                }));
            } else {
                console.error(node.type + ':',e.message);
                console.error(codeFrameColumns(sourceCode, node.loc, {
                    highlightCode: true
                }));
            }
        }
    }
    return {
        evaluate
    }
})();

const globalScope = new Scope();
globalScope.set('console', {
    log: function (...args) {
        console.log(chalk.green(...args));
    },
    error: function (...args) {
        console.log(chalk.red(...args));
    },
    error: function (...args) {
        console.log(chalk.orange(...args));
    },
});
evaluator.evaluate(ast.program, globalScope);

// console.log(globalScope);
