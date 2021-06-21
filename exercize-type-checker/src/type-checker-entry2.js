const { transformFromAstSync } = require('@babel/core');
const  parser = require('@babel/parser');
const typeCheckerPlugin = require('./plugin/type-checker2');

const sourceCode = `
    let name: string = 111;
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

