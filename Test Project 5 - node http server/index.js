
const http = require('http');
const fs=require('fs');
const path=require('path');

const hostname='localhost';
const port='3000';

const server =http.createServer((req,res) => {
    console.log(`user requested for ${req.url} with method as ${req.method}`)

    if(req.method === 'GET'){
        let fileUrl;
        if(req.url === '/') fileUrl = '/index.html';
        else fileUrl=req.url;

        let filePath=path.resolve('./public'+ fileUrl);
        const fileExt = path.extname(filePath);

        if(fileExt === '.html'){
            fs.exists(filePath, (exists)=>{
                if(!exists){
                    res.statusCode = 404;
                    res.setHeader('Content-Type','text/html');
                    res.end(`<html>
                                <body>
                                    <h1> ERROR 404 : File Not Found : ${fileUrl}
                                </body>
                            </html>
                        `)
                    return;
                }

                res.statusCode = 200;
                res.setHeader('Content-Type','text/html');
                fs.createReadStream(filePath).pipe(res);
              
            })
        }else{
            res.statusCode = 404;
            res.setHeader('Content-Type','text/html');
            res.end(`<html>
                        <body>
                            <h1> ERROR 404 : File Not a HTML file : ${fileUrl}
                        </body>
                    </html>
                `)
            return;
        }    
    }else{
        res.statusCode = 404;
        res.setHeader('Content-Type','text/html');
        res.end(`<html>
                    <body>
                        <h1> ERROR 404 : Incorrect http requets : ${req.method}
                    </body>
                </html>
            `)
        return;
    }

   /* res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.end(`<html> 
                <head>
                    <title> http server </title>
                </head>
                <body>
                    <h1> hello i am http server <h1>
                </body>
            </html> 
        `) */
});


server.listen(port,hostname,()=>{
        console.log(`Server running at http://${hostname}:${port}`);
});
