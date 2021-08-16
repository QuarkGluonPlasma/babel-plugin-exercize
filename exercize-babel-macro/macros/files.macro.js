const { createMacro } = require('babel-plugin-macros')
const path = require('path');
const fs = require('fs');

function logMacro({ references, state, babel}) {
  const { default: referredPaths = [] } = references;

  referredPaths.forEach(referredPath => {
    const dirPath =path.join(path.dirname(state.filename), referredPath.parentPath.get('arguments.0').node.value);
    const fileNames = fs.readdirSync(dirPath);

    const ast = babel.types.arrayExpression(fileNames.map(fileName => babel.types.stringLiteral(fileName)));

    referredPath.parentPath.replaceWith(ast);
  });
}

module.exports = createMacro(logMacro);
