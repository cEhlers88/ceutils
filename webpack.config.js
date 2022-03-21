const glob = require("glob");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require("path");

let entries = {};
const types = [
    ...glob.sync("./build/*.ts"),
    ...glob.sync("./build/*/*.ts"),
].map((item)=>{
    return {from:item, to:item.replace('./build','.')}
});

['js'].map(extension=>{
    [
        ...glob.sync("./build/*."+extension),
        ...glob.sync("./build/*/*."+extension)
    ].map((item)=>{
        entries[item] = item;
    });
});

module.exports = {
    mode: 'production',
    entry: {
        ...entries,
        //'dialog': './src/styles/Dialog.scss'
    },
    plugins: [
        new CleanWebpackPlugin(),
        /*new CopyPlugin({
            patterns: types,
            options: {
                concurrency: 100,
            },
        }),*/
    ],
    output: {
        filename:(props)=>{
            return props.chunk.entryModule.rawRequest.substring(8);
        },
        path: path.resolve(__dirname,'dist')
    },
    module: {
        rules: [
            /*{
                test: /\.scss$/,
                use: [
                    'style-loader', // creates style nodes from JS strings
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                        options: {
                            importLoaders: 1
                        }
                    },
                    //'postcss-loader', // post process the compiled CSS
                    'sass-loader' // compiles Sass to CSS, using Node Sass by default
                ]
            }*/
        ],
    },
};
