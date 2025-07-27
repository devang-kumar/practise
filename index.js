const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const DATA_FILE = "todos.json";

function loadTodos() {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data || "[]");
}

function saveTodos(todos) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading HTML");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    } else if (req.url === "/todos" && req.method === "GET") {
        const todos = loadTodos();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(todos));
    } else if (req.url === "/add" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk.toString()));
        req.on("end", () => {
            const { task } = qs.parse(body);
            if (task.trim()) {
                const todos = loadTodos();
                todos.push({ task, timestamp: new Date().toLocaleString() });
                saveTodos(todos);
            }
            res.writeHead(302, { Location: "/" });
            res.end();
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
}).listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
