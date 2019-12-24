const fs = require('fs');
const css = fs.readFileSync("iconfont.css").toString();
let arr = css.match(/\.el-icon-.*?(?=:before)/g);
fs.writeFileSync("icons.js",`export default{data:${JSON.stringify(arr)}}`);