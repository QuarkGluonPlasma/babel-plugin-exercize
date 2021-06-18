const acorn = require("acorn");

const Parser = acorn.Parser;

const ast = Parser.parse(`
    const a = 1;
`);
console.log(JSON.stringify(ast, null, 2));
