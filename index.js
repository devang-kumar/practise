let http = require("http")
let url = require("url")
let fs = require("fs")
let qs = require("querystring")
const PORT = process.env.PORT || 3000;
let savedname=[];
http.createServer((req,res)=>{
    let parsed = url.parse(req.url,true)
    if(req.url=="/"){
        fs.readFile("index.html",(err,data)=>{
            res.end(data);
        })
    }
    if(req.method=="GET" && parsed.pathname=="/sub"){
        res.end(parsed.query.name);
    }
    if(req.method =="POST" && parsed.pathname=="/sub1"){
        let body="";
        req.on("data",chunk=>{
            body+=chunk.toString();
        })
        req.on("end",()=>{
            let parsed1 = qs.parse(body)
            savedname.push(parsed1.name);
            res.writeHead(302, { "Location": "/" });
            res.end();
        })
    }
    if(req.method=="GET" && parsed.pathname=="/ret"){
        res.end(JSON.stringify(savedname))
    }
    if (req.method === "GET" && parsed.pathname === "/delete") {
        const index = parseInt(parsed.query.index);
        savedname.splice(index, 1);
        res.end();
    }
}).listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
