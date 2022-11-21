const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());



leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end(`all leaders details  will be sent on frontend in some time`);
})
.post((req,res,next)=>{
    res.end(`Leader added : ${req.body.name} - ${req.body.description}`);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED on /leaders url endpoint`);
})
.delete((req,res,next)=>{
    res.end(`deleting all the leaders from database `);
});


leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    res.end(` Details of Leader with Id :  ${req.params.leaderId} will be sent to frontend in some time`);
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);

})
.put((req,res,next)=>{
    res.write(`updating Leader details for  : ${req.params.leaderId} \n `);
    res.end(`Leader with id:  ${req.params.leaderId} updated ${req.body.name}`);
})
.delete((req,res,next)=>{    
    res.write(`deleting Leader : ${req.params.leaderId} \n`);
    res.end(`Leader with id given :  ${req.params.leaderId} deleted -  ${req.body.name}`);
});

module.exports=leaderRouter;
