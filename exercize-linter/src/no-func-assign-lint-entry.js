const { transformFromAstSync } = require('@babel/core');
const  parser = require('@babel/parser');
const noFuncAssignLintPlugin = require('./plugin/no-func-assign-lint');

const sourceCode = `
    function foo() {
        foo = bar;
    }

    var a = function hello() {
    hello = 123;
    };
`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous'
});

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [noFuncAssignLintPlugin],
    filename: 'input.js'
});

// console.log(code);

