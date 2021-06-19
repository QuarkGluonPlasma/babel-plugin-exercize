const { SourceMapGenerator } = require('source-map');

class Printer {
    constructor (source) {
        this.buf = '';
        this.sourceMapGenerator = new SourceMapGenerator({
            file: "sourcemap.js",
        });
        this.sourceMapGenerator.setSourceContent('foo.js', source);
        this.printLine = 1;
        this.printColumn = 0;
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
        node.body.forEach(item => {
            this[item.type](item) + ';';
            this.printColumn ++;
            this.nextLine();
        });
    }
    VariableDeclaration(node) {
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
        if (node.loc) {
            this.sourceMapGenerator.addMapping({
                generated: {
                  line: this.printLine,
                  column: this.printColumn
                },
                source: 'foo.js',
                original: node.loc.start
            })
        }
    }
    VariableDeclarator(node) {
        this[node.id.type](node.id);
        this.buf += '=';
        this.printColumn ++;
        this[node.init.type](node.init);
        if (node.loc) {
            this.sourceMapGenerator.addMapping({
                generated: {
                line: this.printLine,
                column: this.printColumn
                },
                source: 'foo.js',
                original: node.loc.start
            })
        }
    }
    Identifier(node) {
        this.buf += node.name;
        if (node.loc) {
            this.sourceMapGenerator.addMapping({
                generated: {
                  line: this.printLine,
                  column: this.printColumn
                },
                source: 'foo.js',
                original: node.loc.start
            })
        }
    }
    NumericLiteral(node) {
        this.buf += node.value;
        if (node.loc) {
            this.sourceMapGenerator.addMapping({
                generated: {
                  line: this.printLine,
                  column: this.printColumn
                },
                source: 'foo.js',
                original: node.loc.start
            })
        }
    }
}
class Generator extends Printer{

    constructor(source) {
        super(source);
    }

    generate(node) {
        this[node.type](node);
        return {
            code: this.buf,
            map: this.sourceMapGenerator.toString()
        }
    }
}
function generate (node, source) {
    return new Generator(source).generate(node);
}

module.exports = generate;
