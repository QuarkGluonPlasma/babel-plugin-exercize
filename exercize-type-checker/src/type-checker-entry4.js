const { transformFromAstSync } = require('@babel/core');
const  parser = require('@babel/parser');
const typeCheckerPlugin = require('./plugin/type-checker4');

const sourceCode = `
    function add<T>(a: T, b: T) {
        return a + b;
    }
    add<number>(1, '2');
`;

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['typescript']
});

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [[typeCheckerPlugin, {
        fix: true
    }]],
    comments: true
});

// console.log(code);

