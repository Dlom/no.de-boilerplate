
/*jslint devel: true, unparam: true, node: true, sloppy: true, 
vars: true, white: true, maxerr: 50, maxlen: 100, indent: 4 */

var http = require("http");
var fs = require("fs");
var path = require("path");

var mime = require("mime");
var URI = require("URIjs");

var l = console.log;

var ENOENT = /ENOENT/;
var EISDIR = /EISDIR/;

var Server = function(config) {
    this.config = config || {
        "basePath": "web",
        "matches": {}
    };
};

Server.prototype.staticFile = function(filename, req, res) {
    var that = this;
    fs.readFile(path.join(that.config.basePath, filename), function(e, buffer) {
        if (e) { that.handleError(e, req, res); } else {
            l("Serving " + path.join("/", filename));
            var headers = {
                "Content-Type": mime.lookup(filename),
                "Content-Length": buffer.length
            };
            res.writeHead(200, headers);
            res.end(buffer);
        }
    });
};

Server.prototype.handleError = function(e, req, res) {
    l(e);
    var code = 500;
    if (e.message.match(ENOENT)) { code = 404; }
    else if (e.message.match(EISDIR)) { code = 400; }
    res.writeHead(code, {"Content-Type": "text/plain"});
    res.end(code + ": " + http.STATUS_CODES[code]);
};

Server.prototype.match = function(pattern, func) {
    if (Array.isArray(pattern)) {
        pattern = pattern.map(function(r) {
            return (r.source == null ? r : r.source);
        }).join("|");
        pattern = "^(" + pattern + ")$";
    }
    if (pattern.hasOwnProperty("source")) {
        pattern = pattern.source;
    }
    this.config.matches[pattern] = func;
    return this;
};

Server.prototype.redirect = function(path, req, res) {
    res.writeHead(302, {"Content-Type": "text/plain", "Location": path});
    res.end("302: " + http.STATUS_CODES[302]);
};

Server.prototype.getPostData = function(req, res, callback) {
    if (req.method === "POST") {
        var fullBody = "";
        req.on("data", function(chunk) {
            fullBody += chunk.toString();
        }).on("end", function() {
            callback(URI.parseQuery(fullBody));
        });
    } else {
        callback({});
    }
};

Server.prototype.getGetData = function(req, res, callback) {
    callback(URI.parseQuery(URI(req.url).query()));
};

Server.prototype.listen = function(port) {
    port = port || 1337;
    var that = this;
    var server = http.createServer(function (req, res) {
        try {
            var matched = false;
            var reqUrl = URI(req.url).pathname();
            l(req.method + " to " + reqUrl);
            var key;
            for (key in that.config.matches) {
                if (that.config.matches.hasOwnProperty(key)) { 
                    if (reqUrl.match(key)) {
                        matched = true;
                        that.config.matches[key](req, res, reqUrl.match(key));
                    }
                }
            }
            if (!matched) {
                that.staticFile(reqUrl, req, res);
            }
        } catch (e) {
            that.handleError(e, req, res);
        }
    });
    if (process.env.NODE_ENV === "production") {
        server.listen(80); // Live
        console.log("Server running on your production server.");
    } else {
        server.listen(port); // Testing
        console.log("Server running at http://127.0.0.1:" + port + "/");
    }
};

module.exports = Server;
