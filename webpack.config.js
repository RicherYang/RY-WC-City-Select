const path = require('path');

const defaultConfig = require('@wordpress/scripts/config/webpack.config', true);
const { fromProjectRoot } = require('@wordpress/scripts/utils/file', true);

const srcPath = fromProjectRoot('assets-src');
const distPath = fromProjectRoot('assets');

module.exports = {
    ...defaultConfig,
    entry: {
        'ry-city-select': path.join(srcPath, 'ry-city-select.js')
    },
    output: {
        ...defaultConfig.output,
        path: distPath,
        filename: '[name].js'
    }
};
