const express = require('express');
const http=require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRouter');

const hostname='localhost';
const port='3000';

const app=express();

app.use(morgan('dev'));
// body of incoming request will be parsed and will be added into req object as req.body so req.body will give
// you access to whatever is inside the body of incoming message 
app.use(bodyParser.json());
app.use('/dishes',dishRouter);

/*
app.get('/dishes/:dishId',(req,res,next)=>{
    res.end(` dish ${req.params.dishId} will be served on frontend in some time`);
});

app.post('/dishes/:dishId',(req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);

});

app.put('/dishes/:dishId',(req,res,next)=>{
    res.write(`updating dish : ${req.params.dishId}`);
    res.end(`
            Dish with id:  ${req.params.dishId} updated ${req.body.name}
            `);
});

app.delete('/dishes/:dishId',(req,res,next)=>{    
    res.write(`deleting dish : ${req.params.dishId} \n`);
    res.end(`Dish with id given :  ${req.params.dishId} deleted -  ${req.body.name}`);
});

*/


/*
order of app.use matters below 
*/


app.use(express.static(__dirname + '/public')); 

//next is a optional parameter
app.use((req,res,next)=>{
    console.log(req.headers);

    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.end(`<html>
                <body> 
                    <h1> EXPRESS PROJECT </h1>
                </body>
            </html>
        `)

});


const server = http.createServer(app);
server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}`);
});