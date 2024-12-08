module.exports = {
    entry: {
        main: './dist/main.js',
        store: './dist/store.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist',
    },
    // Optional and for development only. This provides the ability to
    // map the built code back to the original source format when debugging.
    devtool: 'eval-source-map',
};