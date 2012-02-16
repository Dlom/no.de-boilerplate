    README WIP
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
So, I started hacking away at a little filed called  `server.js` that eventually grew into what is now `node-server.js`.  
Eventually, I decided to make it slightly more useful by uploading it for all the world to see.

## How to use it: 
### Config
In `server.js`, you can see the line `var server = new(require("./node-server.js"))();`.  
You can pass in a server configuration into the `new` statement, which defaults to:

    {
        "basePath": "web",
        "matches": {}
    }
`basePath` is where all the static files are located.  A request for `/index.html` will look for a file in `web/index.html`.  
I'll get to `matches` in a minute.
### Static file serving
Once you have your `server` object, you can call `server.listen()` to start serving static files from your `basePath` directory. 