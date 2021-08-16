const { SourceMapGenerator } = require('source-map');

class Printer {
    constructor (source, fileName) {
        this.buf = '';
        this.sourceMapGenerator = new SourceMapGenerator({
            file: fileName + ".map.json",
        });
        this.fileName = fileName;
        this.sourceMapGenerator.setSourceContent(fileName, source);
        this.printLine = 1;
        this.printColumn = 0;
    }

    addMapping(node) {
        if (node.loc) {
            this.sourceMapGenerator.addMapping({
                generated: {
                  line: this.printLine,
                  column: this.printColumn
                },
                source: this.fileName,
                original: node.loc && node.loc.start
            })
        }
    }

    space() {
        this.buf += ' ';
        this.printColumn ++;
    }

    nextLine() {
        this.buf += '\n';
        this.printLine ++;
        this.printColumn = 0;
    }

    Program (node) {
        this.addMapping(node);
        node.body.forEach(item => {
            this[item.type](item) + ';';
            this.printColumn ++;
            this.nextLine();
        });
    }

    VariableDeclaration(node) {
        if(!node.declarations.length) {
            return;
        }
        this.addMapping(node);

        this.buf += node.kind;
        this.space();
        node.declarations.forEach((declaration, index) => {
            if (index != 0) {
                this.buf += ',';
                this.printColumn ++;
            }
            this[declaration.type](declaration);
        });
        this.buf += ';';
        this.printColumn ++;

    }
    VariableDeclarator(node) {
        this.addMapping(node);
        this[node.id.type](node.id);
        this.buf += '=';
        this.printColumn ++;
        this[node.init.type](node.init);
    }
    Identifier(node) {
        this.addMapping(node);
        this.buf += node.name;
    }
    FunctionDeclaration(node) {
        this.addMapping(node);

        this.buf += 'function ';
        this.buf += node.id.name;
        this.buf += '(';
        this.buf += node.params.map(item => item.name).join(',');
        this.buf += '){';
        this.nextLine();
        this[node.body.type](node.body);
        this.buf += '}';
        this.nextLine();
    }
    CallExpression(node) {
        this.addMapping(node);

        this[node.callee.type](node.callee);
        this.buf += '(';
        node.arguments.forEach((item, index) => {
            if(index > 0 ) this.buf += ', ';
            this[item.type](item);
        })
        this.buf += ')';

    }
    ExpressionStatement(node) {
        this.addMapping(node);

        this[node.expression.type](node.expression);

    }
    ReturnStatement(node) {
       this.addMapping(node);

        this.buf += 'return ';
        this[node.argument.type](node.argument); 

    }
    BinaryExpression(node) {
       this.addMapping(node);

        this[node.left.type](node.left);
        this.buf += node.operator;
        this[node.right.type](node.right);

    }
    BlockStatement(node) {
       this.addMapping(node);

        node.body.forEach(item => {
            this.buf += '    ';
            this.printColumn += 4;
            this[item.type](item);
            this.nextLine();
        });

    }
    NumericLiteral(node) {
       this.addMapping(node);

        this.buf += node.value;

    }
}
class Generator extends Printer{

    constructor(source, fileName) {
        super(source, fileName);
    }

    generate(node) {
        this[node.type](node);
        return {
            code: this.buf,
            map: this.sourceMapGenerator.toString()
        }
    }
}
function generate (node, source, fileName) {
    return new Generator(source, fileName).generate(node);
}

module.exports = generate;
