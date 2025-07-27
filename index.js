const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

let todos = [];

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
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
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
            const formData = qs.parse(body);
            if (formData.todo) {
                todos.push(formData.todo);
            }
            res.writeHead(302, { "Location": "/" });
            res.end();
        });
    }
    else if (req.method === "GET" && parsedUrl.pathname === "/delete") {
        const index = parseInt(parsedUrl.query.index);
        if (!isNaN(index)) {
            todos.splice(index, 1);
        }
        res.writeHead(302, { "Location": "/" });
        res.end();
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }

}).listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
