const express = require('express');
const http=require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRouter');
const promoRouter=require('./routes/promoRouter');
const leaderRouter=require('./routes/leaderRouter');

const hostname='localhost';
const port='3000';

const app=express();

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));


/*
 use it app.use('/dishes', dishRouter.Router);  when in dishRouter.js you export as
 module.exports.Router=dishRouter;
*/
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);


//DEFAULT BEHAVIOUR FOR NOW
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



