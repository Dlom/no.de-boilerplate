
/*jslint devel: true, unparam: true, node: true, sloppy: true, vars: 
true, white: true, regexp: true, maxerr: 50, maxlen: 100, indent: 4 */

var server = new(require("./node-server.js"))();
var URI = require("URIjs");

server.match(/^\/(([^\/\\\?%\*:\|"'<> ]+?\/)*?)$/, function(req, res, regex) {
    server.staticFile(regex[1] + "/index.html", req, res);
}).match(/^\/([^\/\\\?%\*:\|"'<> ]+?)\.(ico|png)$/, function(req, res, regex) {
    server.staticFile("img/" + regex[1] + "." + regex[2], req, res);
});
server.listen();
