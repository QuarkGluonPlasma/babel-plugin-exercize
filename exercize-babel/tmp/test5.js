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

function traverse(node, visitors) {
    const defination = astDefinationsMap.get(node.type);

    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }

    visitorFuncs.enter && visitorFuncs.enter(node);

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach(childNode => {
                    traverse(childNode, visitors);
                })
            } else {
                traverse(prop, visitors);
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(node);
}

const ast = newParser.parse(`
    const a = 1;
`);

traverse(ast, {
    Identifier: {
        enter(node) {
            console.log('enter');
        },
        exit(node) {
            console.log('exit');
            node.name = 'b';
        }
    }
});

console.log(JSON.stringify(ast, null, 2));
