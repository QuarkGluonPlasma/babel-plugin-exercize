module.exports = class DependencyNode {
    constructor(path = '', imports = {}, exports = []) {
        this.path = path;
        this.imports = imports;
        this.exports = exports;
        this.subModules = {};
    }
}