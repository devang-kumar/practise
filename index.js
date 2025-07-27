let http = require("http");
let fs = require("fs");
let url = require("url");
let qs = require("querystring");

const PORT = process.env.PORT || 3000;
let todos = [];

http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true);

    if (req.method === "GET" && parsedUrl.pathname === "/") {
        fs.readFile("index.html", (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }

    else if (req.method === "GET" && parsedUrl.pathname === "/todos") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(todos));
    }

    else if (req.method === "POST" && parsedUrl.pathname === "/add") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const { todo } = qs.parse(body);
            if (todo) todos.push(todo);
            res.writeHead(302, { Location: "/" });
            res.end();
        });
    }

    else if (req.method === "GET" && parsedUrl.pathname === "/delete") {
        const index = parseInt(parsedUrl.query.index);
        if (!isNaN(index) && index >= 0 && index < todos.length) {
            todos.splice(index, 1);
        }
        res.writeHead(302, { Location: "/" });
        res.end();
    }

    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }

}).listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
