const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.ts',
        canvasLib: './src/lib/canvas.ts',
        domLib: './src/lib/dom.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: '@cehlers88/ceutils',
            type: 'umd',
            export: 'default',
        },
        globalObject: 'this',
    },
};