const { isLoadedByLoaders } = require('./isLoadedByLoaders');
const { STYLABLE } = require('./StyleableSymbols');
const path = require('path');
const CommonJsRequireDependency = require('webpack/lib/dependencies/CommonJsRequireDependency');
const RequireHeaderDependency = require('webpack/lib/dependencies/RequireHeaderDependency');
const {
    StylableExportsDependency,
    StylableImportDependency,
    StylableAssetDependency
} = require('./StylableDependencies');
const { isAsset, makeAbsolute } = require('@stylable/core');

const stylableExtension = /\.st\.css$/;

class StylableParser {
    constructor(options) {
        this.options = options;
    }
    parse(source, state) {
        const compilation = state.compilation;
        if (
            isLoadedByLoaders(state.module, () => {
                compilation.warnings.push(
                    `Loading a Stylable stylesheet via webpack loaders is not supported and may cause runtime errors.\n"${
                        state.module.rawRequest
                    }" in "${state.module.issuer.resource}"`
                );
            })
        ) {
            return state;
        }
        const stylable = compilation[STYLABLE];
        const meta = stylable.process(state.module.resource);
        state.module.buildInfo.stylableMeta = meta;
        // state.module.buildMeta.exportsType = "namespace";
        meta.urls
            .filter(url => isAsset(url))
            .forEach(asset => {
                const absPath = makeAbsolute(
                    asset,
                    compilation.options.context,
                    path.dirname(state.module.resource)
                );
                state.module.buildInfo.fileDependencies.add(absPath);
                state.module.addDependency(new StylableAssetDependency(absPath));
            });

        state.module.addDependency(new StylableExportsDependency(['default']));

        meta.imports.forEach(stylableImport => {
            state.module.buildInfo.fileDependencies.add(stylableImport.from);
            if (stylableImport.fromRelative.match(stylableExtension)) {
                const importRef = {
                    defaultImport: stylableImport.defaultExport,
                    names: []
                };
                const dep = this.options.useWeakDeps
                    ? StylableImportDependency.createWeak(
                          stylableImport.fromRelative,
                          state.module,
                          importRef
                      )
                    : new StylableImportDependency(stylableImport.fromRelative, importRef);
                state.module.addDependency(dep);
                try {
                    this.addChildDeps(
                        stylable,
                        stylableImport,
                        state.module.buildInfo.fileDependencies
                    );
                } catch (e) {}
            }
            //TODO: handle js dependencies?
        });

        return state;
    }
    addChildDeps(stylable, stylableImport, fileDependencies) {
        stylable.process(stylableImport.from).imports.forEach(childImport => {
            if (childImport.fromRelative.match(stylableExtension)) {
                if (!fileDependencies.has(childImport.from)) {
                    fileDependencies.add(childImport.from);
                    this.addChildDeps(stylable, childImport, fileDependencies);
                }
            }
        });
    }
}

module.exports = StylableParser;
