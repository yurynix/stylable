const { join } = require('path');
const HTML = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

require('./server');

const monorepoRoot = join(__dirname, '..', '..');

module.exports = {
    mode: 'development',
    entry: {
        playground: './playground.ts'
    },
    output: {
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.mjs', '.js', '.json'],
        plugins: [new TsconfigPathsPlugin({ configFile: join(monorepoRoot, 'tsconfig.json') })]
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new HTML({
            template: './index.html'
        })
    ],
    module: {
        noParse: /codemirror\.js/,
        rules: [
            {
                test: /\.tsx?$/,
                loader: '@ts-tools/webpack-loader'
            }
        ]
    }
};
