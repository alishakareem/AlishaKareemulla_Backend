// https://alisha-backend.azurewebsites.net


const http = require('http');
const path = require("path");
const fs = require("fs");


var MongoClient = require('mongodb-legacy').MongoClient;
var url = "mongodb+srv://alisha:alisha123@vaccines.cokyxr7.mongodb.net/?retryWrites=true&w=majority";


// creating server

const server = http.createServer((req, res) => {
    
    /*
        we can Navigate to different pages via different requests. 
        if / then goto index.html
        if /about about then goto about.html
        if /api then laod the JSON file  /  ;) this might be something you need for your exam. 
     */
   
    
    if (req.url === '/') {
        // read public.html file from public folder
        fs.readFile(path.join(__dirname, 'public', 'index.html'),
                    (err, content) => {                 
                                    if (err) throw err;
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    res.end(content);
                        }
              );
     }


    else if(req.url === "/about"){
        fs.readFile("./public/about.html", "UTF-8", function(err, html){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        });
    }
    
    else if(req.url.match("\.css$")){
        var cssPath = path.join(__dirname, 'public', req.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);
    }
  
    else if(req.url.match("\.jpg$")){
        var imagePath = path.join(__dirname, 'public', req.url);
        var fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "image/png"});
        fileStream.pipe(res);
    }

    else if(req.url.match("\.png$")){
        var imagePath = path.join(__dirname, 'public', req.url);
        var fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "image/png"});
        fileStream.pipe(res);
    }
   
    else if (req.url==='/api')
    {
        MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
            if(err) {
                console.log(err);
            }
            else {
                var dbo = db.db("vaccinesDB");
                dbo.collection('Covid19Vaccines').find({}).toArray(function(err,result){
                if(err) throw err;
                res.writeHead(200,{"Content-Type":"application/json"});
                res.end(JSON.stringify(result));
                });
            }
        })
    }

    else{
        res.end("<h1> 404 Error: Requested URL not found</h1>");
    }

});

const PORT= process.env.PORT || 1234;

server.listen(PORT,()=> console.log(`Great our server is running on port ${PORT} `));