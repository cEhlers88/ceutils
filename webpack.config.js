const glob = require("glob");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
let entries = {};
[
    ...glob.sync("./build/*.js"),
    ...glob.sync("./build/*/*.js")
].map((item)=>{
    entries[item] = item;
});

module.exports = {
    mode: 'production',
    entry: entries,
    plugins: [
        new CleanWebpackPlugin()
    ],
    output: {
        filename:(props)=>{
            return props.chunk.entryModule.rawRequest.substring(8);
        }
    }
};