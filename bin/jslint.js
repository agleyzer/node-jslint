#!/usr/bin/env node
// jslint wrapper for nodejs
// Adapted from rhino.js. Copyright 2002 Douglas Crockford
// Shebang removal regex uses insecure "."
// JSLINT is provided by fulljslint.js modified to export the global

var assert = require("assert");
var path = require("path");
var sys = require("sys");
var fs = require("fs");
var JSLINT = require("../lib/fulljslint_export").JSLINT;

function processArguments(args) {
    var re = new RegExp("--(\\w+)=(.+)");
    var res = {files:[]};
    
    args.forEach(function(arg) {
	var m = re.exec(arg);
	if (m) {
	    res[m[1]] = m[2];
	} else {
	    res.files.push(arg);
	}
    });

    return res;
}

// assert.deepEqual({files:[]}, processArguments([]));
// assert.deepEqual({files:["foo"]}, processArguments(["foo"]));
// assert.deepEqual({files:["foo.js"], config:"conf.file", baz:"bang"}, processArguments(["--config=conf.file", "foo.js", "--baz=bang"]));

function existsSync(path) {
    try {
	fs.statSync(path);
	return true;
    } catch (e) {
	if (e.errno == 2) { // ENOENT
	    return false;
	} else {
	    throw e;
	}
    }
}

function getConfig(args) {
    function read(path) {
	try {
	    return JSON.parse(fs.readFileSync(path));
	} catch (e) {
	    sys.puts("jslint: failed to read config file " + path + ": " + e.message);
	    process.exit(1);
	}
    }

    var defaultConfig = {
	predef:   [ 
            // CommonJS
	    "exports",
	    // YUI
	    "YUI",
	    "YAHOO",
	    "YAHOO_config",
	    "YUI_config",
	    "Y",
	    // NodeJS
	    "GLOBAL",
	    "process",
	    "require",
	    "__filename",
	    "__dirname",
	    "module"       
	]	 
    };

    if (args.config) {
	return read(args.config);
    } 
    
    var f = process.env.HOME + "/.jslint";

    if (existsSync(f)) {
	return read(f);
    }

    return defaultConfig;
}


var args = processArguments(process.ARGV.slice(2));

var file = args.files[0];

if (!file) {
    sys.puts("Usage: jslint file.js");
    process.exit(1);
}

var input = fs.readFileSync(file);

if (!input) {
    sys.puts("jslint: Couldn't open file '" + file + "'.");
    process.exit(1);
} else {
    input = input.toString("utf8");
}

// remove shebang (lifted from node.js)
input = input.replace(/^\#\!.*/, "");

var success = JSLINT(input, getConfig(args));

if (!success) {
    JSLINT.errors.forEach(function(e) {
        sys.puts(path.basename(file) + '(' + e.line + ',' + 
		 e.character + ') JSLINT: ' + e.reason);

        sys.puts( '    ' + (e.evidence || '').replace(/^\s+|\s+$/, ""));
    });

    process.exit(2);
}

sys.puts("OK");
