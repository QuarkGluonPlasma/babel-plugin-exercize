const { transformFromAstSync, parseSync } = require('@babel/core');
const  parser = require('@babel/parser');
const insertParametersPlugin = require('./plugin/parameters-insert-plugin');
const fs = require('fs');
const path = require('path');

const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.js'), {
    encoding: 'utf-8'
});

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx']
});

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [insertParametersPlugin]
});

console.log(code);
