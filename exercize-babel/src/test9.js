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

function template(code) {
    return newParser.parse(code);
}
template.expression = function(code) {
    return template(code).body[0].expression;
}

function traverse(node, visitors, parent, parentPath, key, listKey) {
    const defination = astDefinationsMap.get(node.type);

    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }
    const path = new NodePath(node, parent, parentPath, key, listKey);

    visitorFuncs.enter && visitorFuncs.enter(path);

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach((childNode, index) => {
                    traverse(childNode, visitors, node, path, key, index);
                })
            } else {
                traverse(prop, visitors, node, path, key);
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(path);
}

class Printer {
    constructor () {
        this.buf = '';
    }

    space() {
        this.buf += ' ';
    }

    nextLine() {
        this.buf += '\n';
    }

    Program (node) {
        node.body.forEach(item => {
            this[item.type](item) + ';';
            this.nextLine();
        });

    }
    VariableDeclaration(node) {
        this.buf += node.kind;
        this.space();
        node.declarations.forEach((declaration, index) => {
            if (index != 0) {
                this.buf += ',';
            }
            this[declaration.type](declaration);
        });
        this.buf += ';';
    }
    VariableDeclarator(node) {
        this[node.id.type](node.id);
        this.buf += '=';
        this[node.init.type](node.init);
    }
    Identifier(node) {
        this.buf += node.name;
    }
    NumericLiteral(node) {
        this.buf += node.value;
    }

}
class Generator extends Printer{

    generate(node) {
        this[node.type](node);
        return this.buf;
    }
}
function generate (node) {
    return new Generator().generate(node);
}

const sourceCode = `
const a = 1,b=2,c=3;
const d=4,e=5;
`;

ast = newParser.parse(sourceCode);
traverse(ast, {
    NumericLiteral(path) {
        if (path.node.value === 2) {
            path.replaceWith(template.expression('aaaaa'));
        }
    } 
})
console.log(generate(ast));
