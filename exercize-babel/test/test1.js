const parser = require('../src/parser');
const traverse = require('../src/traverse');
const template = require('../src/template');
const generate = require('../src/generator');

const sourceCode = `
const a = 1;
const c = 2;
`;

const ast = parser.parse(sourceCode, {
    plugins: ['literal', 'guangKeyword']
});

traverse(ast, {
    Program(path) {
        path.node.body.unshift(template('const b = 2;').body[0]);
    }
    // NumericLiteral(path) {
    //     path.replaceWith(template.expression('ccc'));
    // }
});

// console.log(ast);
const { code, map} = generate(ast, sourceCode);
console.log(code);
console.log(map);


