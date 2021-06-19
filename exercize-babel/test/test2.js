const { transformSync } = require('../src/core');


const sourceCode = `
const a = 1;
`;

function plugin1(api, options) {
    return {
        visitor: {
            Identifier(path) {
                    // path.node.value = 2222;
                    path.replaceWith(api.template.expression(options.replaceName));
            }
        }
    }
}

const code = transformSync(sourceCode, {
    parserOpts: {
        plugins: ['literal']
    },
    plugins: [
        [   
            plugin1,
            {
                replaceName: 'ddddd'
            }
        ]
    ]
});

console.log(code);
