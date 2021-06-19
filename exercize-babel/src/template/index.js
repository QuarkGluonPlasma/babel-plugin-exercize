const parser = require('../parser');

function template(code) {
    return parser.parse(code, {
        plugins: ['literal']
    });
}
template.expression = function(code) {
    return template(code).body[0].expression;
}

module.exports = template;
