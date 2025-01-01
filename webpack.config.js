const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
    return {
        mode: argv.mode === 'production' ? 'production' : 'development',
        entry: {
            index: './src/index.ts',
            canvasLib: './src/lib/canvas.ts',
            domLib: './src/lib/dom.ts',
            ...(argv.mode === 'production' ? {lala:'./src/dev.ts'} : { dev: './src/dev.ts' })
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: [/node_modules/, /\.d\.ts$/],
                },
                {
                    test: /\.scss$/i,
                    use: ["style-loader", "css-loader", "sass-loader"],
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
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            port: 9000,
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                template: "./src/index.html",
                filename: 'index.html'
            })
        ]
    };
}