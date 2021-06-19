const astDefinationsMap = new Map();

astDefinationsMap.set('Program', {
    visitor: ['body']
});
astDefinationsMap.set('VariableDeclaration', {
    visitor: ['declarations']
});
astDefinationsMap.set('VariableDeclarator', {
    visitor: ['id', 'init']
});
astDefinationsMap.set('Identifier', {});
astDefinationsMap.set('NumericLiteral', {});

module.exports = astDefinationsMap;
