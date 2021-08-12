const parser = require('../parser');

function template(code) {
    return parser.parse(code, {
        plugins: ['literal']
    });
}
template.expression = function(code) {
    const node =  template(code).body[0].expression;
    node.loc = null;
    return node;
}

module.exports = template;
