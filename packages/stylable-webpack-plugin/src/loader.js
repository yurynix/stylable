const { RawSource } = require('webpack-sources');
const { basename } = require('path');
const { Stylable } = require('stylable');

let stylable;

module.exports = function(source) {
    if (!stylable) {
        stylable = Stylable.create({
            projectRoot: this.rootContext,
            fileSystem: this.fs
        });
    }
    const done = this.async();
    const res = stylable.transform(source, this.resourcePath);
    const css = res.meta.outputAst.toString();
    const name = basename(this.resourcePath).replace('st', 'plain');

    this.loadModule(this.resourcePath.replace('.st.css', ''), (err, source, sourceMap, module) => {
        this.callback(null, gen(res, css), {});
    });

    this._compilation.hooks.additionalChunkAssets.tap(name, chunks => {
        this._compilation.assets[name] = new RawSource(css);
        chunks.forEach(chunk => {
            // if(chunk.containsModule(this._module)){
            chunk.files.unshift(name);
            // }
        });
    });

    // return gen(res, css);
};

module.exports.pitch = function() {
    // debugger;
};

function gen(stylableResult, cssString) {
    const { exports, meta } = stylableResult;
    const localsExports = JSON.stringify(exports);
    const root = JSON.stringify(meta.root);
    const namespace = JSON.stringify(meta.namespace);
    const css = cssString ? JSON.stringify(cssString) : 'null';
    const imports = meta.imports.map(
        (i, index) =>
            i.fromRelative.match(/\.st\.css$/)
                ? `import __style__${index} from "${i.fromRelative}";`
                : ''
    );
    return `
    ${imports.join('\n')}
    import { create } from "stylable-runtime";
    export default create(
            ${root},
            ${namespace},
            ${localsExports},
            ${css},
            -1,
            module.id
        );
    `;
}

class InlineStylable {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('InlineStylable', (compilation, { normalModuleFactory }) => {
            const handler = (parser, parserOptions) => {
                parser.hooks.call.for('stylable').tap('ss', (a, b, c, d) => {
                    parser.evaluateExpression(a.arguments[0]);
                });
            };

            normalModuleFactory.hooks.parser.for('javascript/auto').tap('ProvidePlugin', handler);
            normalModuleFactory.hooks.parser
                .for('javascript/dynamic')
                .tap('ProvidePlugin', handler);
            normalModuleFactory.hooks.parser.for('javascript/esm').tap('ProvidePlugin', handler);
        });
    }
}
