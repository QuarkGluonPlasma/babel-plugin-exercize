/*
 * @Author: QuarkGluonPlasma
 * @Date: 2022-09-23 14:26:10
 * @LastEditors: pym
 * @Description: 把docs数据转为md格式
 * @LastEditTime: 2022-10-09 19:11:50
 */
module.exports = function(docs) {
    let str = '';

    docs.forEach(doc => {
        if (doc.type === 'function') {
            str += '##' + doc.name + '\n';
            str += doc.doc.description + '\n';
            if (doc.doc.tags) {
                doc.doc.tags.forEach(tag => {
                    str += (tag.name || tag.title) + ': ' + tag.description.replace(':','')  + '\n'; 
                    // str += tag.name + ': ' + tag.description + '\n'; 
                })
            }
            str += '>' + doc.name + '(';
            if (doc.params) {
                str += doc.params.map(param => {
                    return param.name + ': ' + param.type;
                }).join(', ');
            }
            str += ')\n';
            str += '#### Parameters:\n';
            if (doc.params) {
                str += doc.params.map(param => {
                    return '-' + param.name + '(' + param.type + ')';
                }).join('\n');
            }
            str += '\n'
        } else if (doc.type === 'class'){
            str += '##' + doc.name + '\n';
            str += doc.doc.description + '\n';
            if (doc.doc.tags) {
                doc.doc.tags.forEach(tag => {
                    str += tag.name + ': ' + tag.description + '\n'; 
                })
            }
            str += '> new ' + doc.name + '(';
            if (doc.params) {
                str += doc.params.map(param => {
                    return param.name + ': ' + param.type;
                }).join(', ');
            }
            str += ')\n';
            str += '#### Properties:\n';
            if (doc.propertiesInfo) {
                doc.propertiesInfo.forEach(param => {
                    str += '-' + param.name + ':' + param.type + '\n';
                });
            }
            str += '#### Methods:\n';
            if (doc.methodsInfo) {
                doc.methodsInfo.forEach(param => {
                    str += '-' + param.name + '\n';
                });
            }
            str += '\n'
        }
        str += '\n'
    })
    return str;
}
