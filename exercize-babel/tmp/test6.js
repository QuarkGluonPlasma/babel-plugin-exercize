const acorn = require("acorn");

const Parser = acorn.Parser;

var literalExtend = function(Parser) {
  return class extends Parser {
    parseLiteral (...args) {
        const node = super.parseLiteral(...args);
        switch(typeof node.value) {
            case 'number':
                node.type = 'NumericLiteral';
                break;
            case 'string':
                node.type = 'StringLiteral';
                break;
        }
        return  node;
    }
  }
}
const newParser = Parser.extend(literalExtend);


const astDefinationsMap = new Map();

astDefinationsMap.set('Program', {
    visitor: ['body']
});
astDefinationsMap.set('VariableDeclaration', {
    visitor: ['declarations']
});
astDefinationsMap.set('VariableDeclarator', {
    visitor: ['id', 'init']
});
astDefinationsMap.set('Identifier', {});
astDefinationsMap.set('NumericLiteral', {});


class NodePath {
    constructor(node, parent, parentPath) {
        this.node = node;
        this.parent = parent;
        this.parentPath = parentPath;
    }
}

function traverse(node, visitors, parent, parentPath) {
    const defination = astDefinationsMap.get(node.type);

    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }
    const path = new NodePath(node, parent, parentPath);

    visitorFuncs.enter && visitorFuncs.enter(path);

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach(childNode => {
                    traverse(childNode, visitors, node, path);
                })
            } else {
                traverse(prop, visitors, node, path);
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(path);
}

const ast = newParser.parse(`
    const a = 1;
`);

traverse(ast, {
    Identifier: {
        exit(path) {
            path.node.name = 'b';
            let curPath = path;
            while (curPath) {
                console.log(curPath.node.type);
                curPath = curPath.parentPath;
            }
        }
    }
});

// console.log(JSON.stringify(ast, null, 2));
