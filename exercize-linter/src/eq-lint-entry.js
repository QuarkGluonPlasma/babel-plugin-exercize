const { transformFromAstSync } = require('@babel/core');
const  parser = require('@babel/parser');
const eqLintPlugin = require('./plugin/eq-lint');

const sourceCode = `
const four = /* foo */ add(2, 2);


// a == b;
// foo == true
// bananas != 1;
// value == undefined
// typeof foo == 'undefined'
// 'hello' != 'world'
// 0 == 0
// true == true
`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    comments: true
});

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [[eqLintPlugin, {
        fix: true
    }]],
    comments: true
});

console.log(code);

