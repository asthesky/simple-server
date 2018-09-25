"use strict"
const http = require('http');
const path = require("path");
const url = require("url");
const fs = require("fs");
// 
const queryParse = (url) => {
    var str = url.split("?")[1] || url,
        items = str.split("&"),
        result = {},
        arr;
    for (var i = 0; i < items.length; i++) {
        arr = items[i].split('=');
        result[arr[0]] = arr[1];
    }
    return result;
};
// 
class Router {
    constructor() {
        if (!this.routerData) {
            this.routerData = []
        }
    }
    catch(req, res) {
        var pathname = url.parse(req.url).pathname,
            match = this.match(pathname);
        if (!match) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('This is </b>404</b>');

        } else {
            match(req, res);
        }
    }
    add(pathname, handler) {
        if (!pathname || !handler) return;
        this.routerData.push({
            'pathname': pathname,
            'handler': handler
        });
    }
    match(pathname) {
        var routerData = this.routerData;
        for (var i = 0; i < routerData.length; i++) {
            if (routerData[i].pathname === pathname) {
                return routerData[i].handler;
            }
        }
    }
}
// 
const mime = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "png": "image/png",
    "txt": "text/plain"
};
// 
const app = http.createServer((req, res) => {
    var pathname = url.parse(req.url).pathname;
    if (pathname.indexOf('/public') > -1) {
        app.static(req, res);
    } else {
        app.router.catch(req, res);
    }
});
app.listen('10746', () => {
    console.log('start');
});


//静态路由
app.static =  (req, res) => {
    var pathname = url.parse(req.url).pathname;
    var ext = path.extname(pathname);
    ext = ext ? ext.slice(1) : 'unknown';
    var contentType = mime[ext] || "text/plain";
    var filepath = path.join(__dirname, req.url);
    fs.exists(filepath, (exists) => {
        if (exists) {
            fs.stat(filepath, (err, stats) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/html;' });
                    res.end('<div>500</div>');
                } else {
                    if (stats.isFile()) {
                        var file = fs.createReadStream(filepath);
                        res.setHeader("Content-Type", contentType);
                        file.pipe(res);
                    }
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html;' });
            res.end('<div>404</div>');
        }
    });
};
//动态路由
app.router = new Router();
var controller = require('./controller/');
app.router.add('/index', (req, res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    var filepath = path.join(__dirname, '/view/index.html');
    fs.stat(filepath, (err, stats) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html;' });
            res.end('<div>500</div>');
        } else {
            if (stats.isFile()) {
                var file = fs.createReadStream(filepath);
                res.writeHead(200, { 'Content-Type': 'text/html;' });
                file.pipe(res);
            }
        }
    });
})
app.router.add('/data', (req, res) => {
    var query = url.parse(req.url).query,
        queryObj = queryParse(query);
    var resData = controller.data(queryObj);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        status: 100,
        data: resData
    }));
});
app.router.add('/mock', (req, res) => {
    var query = url.parse(req.url).query,
        queryObj = queryParse(query);
    if (queryObj) {
        queryObj.course = queryObj.course.split('|');
    }
    controller.mack(queryObj);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        status: 100,
        data: null
    }));
});

var exec = require('child_process').exec;

require('child_process').exec("start http://127.0.0.1:10746/index")