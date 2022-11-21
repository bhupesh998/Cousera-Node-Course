const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());



leaderRouter.route('/')
.get((req,res,next)=>{
    Leaders.find({})
    .then((leaders)=>{
        if(leaders !=null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        }else{
            err= new Error('No Leaders are there currently');
            err.statusCode = 404;
            next(err);
        }     
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.post((req,res,next)=>{
    Leaders.create(req.body)
    .then((leaders)=>{
        console.log('leader profile created by post',leaders);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);
})
.delete((req,res,next)=>{
    Leaders.remove({})
    .then((resp)=>{
        console.log('Delete operation response',resp);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
});



leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leaders)=>{
        if(leaders != null){
            console.log('leaders returned by leaders/leaderId is  ',leaders);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        }else{
            err= new Error(`No leaders are there with id ${req.params.leaderId}`);
            err.statusCode = 404;
            next(err);
        }     
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);

})
.put((req,res,next)=>{
   Leaders.findByIdAndUpdate(req.params.leaderId,{
    $set : req.body },{ new : true})
    .then((leaders)=>{
        if(leaders != null){
            console.log('leaders updated by leaders/leaderId is  ',leaders);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        }else{
            err= new Error(`No leaders are there with id ${req.params.leaderId}`);
            err.statusCode = 404;
            next(err);
        }     
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.delete((req,res,next)=>{    
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        console.log('Delete operation response',resp);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
});

module.exports=leaderRouter;
