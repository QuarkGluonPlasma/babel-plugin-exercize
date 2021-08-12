const parser = require('../src/parser');
const traverse = require('../src/traverse');
const template = require('../src/template');
const generate = require('../src/generator');

const sourceCode = `const c = 1;
const d = 2;
const e = 4;

function add(a, b) {
    const tmp = 1;
    return a + b;
}

add(c, d);
`;

const ast = parser.parse(sourceCode, {
    plugins: ['literal', 'guangKeyword']
});

traverse(ast, {
    Program(path) {
       Object.entries(path.scope.bindings).forEach(([id, binding]) => {
        if (!binding.referenced) {
            binding.path.remove();
        }
       });

        // console.log(path.scope);
        // path.node.body.unshift(template('const b = 2;').body[0]);
    },
    FunctionDeclaration(path) {
        // console.log(path.scope); 
    }
});

// console.log(ast);
const { code, map} = generate(ast, sourceCode, 'foo.js');
console.log(code);
console.log(map);


