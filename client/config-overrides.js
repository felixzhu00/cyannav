const webpack = require('webpack');

module.exports = function override(config, env) {
    // Adding fallbacks for Node.js modules
    config.resolve.fallback = {
        url: require.resolve('url'),
        fs: require.resolve('fs'),
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
    };

    // Adding ProvidePlugin for `process` and `Buffer`
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );

    // Adding the rule to resolve fully specified imports for `.js` and `.mjs` files
    config.module.rules.push({
        test: /\.m?js/, 
        resolve: { 
            fullySpecified: false 
        }
    });

    return config;
};
