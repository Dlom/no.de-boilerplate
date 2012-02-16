# no.de boilerplate

## Install:
    git clone git://github.com/Dlom/no.de-boilerplate.git
    npm install

## Deploy:
### With no.de smartmachine:
Follow the instructions provided to push your repo to the smartmachine
### Other server
    TODO

## What it is:
I needed something easy to setup a few testing ideas live at [no.de](https://no.de).  
So, I started hacking away at a little filed called  `server.js` that eventually grew into what is now
`node-server.js`.  
Eventually, I decided to make it slightly more useful by uploading it for all the world to see.

## How to use it: 
### Config
In `server.js`, you can see the line `var server = new(require("./node-server.js"))();`.  
You can pass in a server configuration into the `new` statement, which defaults to:

    {
        "basePath": "web",
        "matches": {}
    }
`basePath` is where all the static files are located.  A request for `/index.html` will look for a file in
`web/index.html`.  
I'll get to `matches` in a minute.
### Static file serving
Once you have your `server` object, you can call `server.listen()` to start serving static files from your `basePath`
directory. 
### URL Matching
You can have the server match every url that comes through against a regex that then executes the your code.  For
example, here's the code that serves up the index files of directories:

    server.match(/^\/(([^\/\\\?%\*:\|"'<> ]+?\/)*?)$/, function(req, res, regex) {
        server.staticFile(regex[1] + "/index.html", req, res);
    });

`server.match` takes a regex and a callback.  The callback receives the `request` object, the `response` object, and
the resulting array from the regex match.  The `server` object also has some special methods for use here, namely
`staticFile(fileName, req, res)`, `redirect(path, req, res)`, and the `getGetData(req, res, callback)` and
`getPostData(req, res, callback)` functions.  These last two call the callback with a key/value object that has either
the POST or the GET data.  For example:

    server.match(/^\/formhandler\.html$/, function(req, res) {
        getPostData(req, res, function(post) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end(post.username);
        });
    });

These functions are mostly just convinience functions.  
You can pass a `matches` object in the config object that has regex/function values, to avoid having to call `match`
over and over again.  `match` is chainable, however, allowing you to do `server.match().match().match().listen()`;
