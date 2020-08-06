const FileUtils = require('../../utils/FileUtils')
const JsonUtils = require('../../utils/JsonUtils')

let securityTokenJson = require('../../build/contracts/SecurityToken');
let abiSecurityToken = "var abiSecurityToken =" + JsonUtils.stringify(securityTokenJson.abi) + ";";
abiSecurityToken += "(function(exports){\n";
abiSecurityToken += "    exports.abiSecurityToken = abiSecurityToken;\n";
abiSecurityToken += "}(typeof exports === 'undefined' ? this.share = {} : exports));\n";

console.log(abiSecurityToken);
// FileUtils.writeFile(__dirname+'/../doc/public/js/config.js', abiSecurityToken);

