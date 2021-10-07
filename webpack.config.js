const glob = require("glob");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require("path");

let entries = {};
const types = [
    ...glob.sync("./build/*.ts"),
    ...glob.sync("./build/*/*.ts")
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
    entry: entries,
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
    }
};