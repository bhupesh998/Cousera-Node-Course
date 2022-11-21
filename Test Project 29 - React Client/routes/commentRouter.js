const express = require('express');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Comments=require('../models/comment');

const commentRouter = express.Router();
commentRouter.use(bodyParser.json());


commentRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus =200;
})
.get(cors.cors,(req,res,next)=>{
    Dishes.find(req.query)
    .populate('author')
    .then((comments)=>{
        if(comments != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(comments);
        }else{
            err = new Error(`No dish present in database with id : ${req.params.dishId}`);
            err.statusCode=404;
            next(err);
        }
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    if(req.body !=null){
        req.body.author = req.user._id;
        Comments.create(req.body)
        .then((comment)=>{
            Comments.findById(comment._id)
            .populate('author')
            .then((comment)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(comment);
            })
        
        },(err)=> next(err))
        .catch((err)=>{
            next(err);
        })
    }else{
        err = new Error(`Comment not found in request body`);
        err.status=404;
        next(err);
    }

})
.put(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED on ${req.params.url}`);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Comments.remove({})
    .then((resp)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
});


commentRouter.route('/:commentId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus =200;
})
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.commentId)
    .populate('author')
    .then((comment)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(comment);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });

})
.post(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED on endpoint ${req.params.commentId} `);

})
.put(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next)=>{
    Comments.findById(req.params.commentId)
    .then((comment)=>{  
        if(comment != null ){
            if(!comment.author.equals(req.user._id)){
                err = new Error(`you are not authorized to perform this operation`);
                err.statusCode=403;
                next(err);
            }
            req.body.author = req.user._id;
            Comments.findByIdAndUpdate(req.params.commentId,{$set:req.body},{new:true})
            .then((comment)=>{
                Comments.findById(comment._id)
                .populate('author')
                .then((comment)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(comment);
                })          
            },(err)=> next(err));
            }else{
                err = new Error(`No comment present in database with id : ${req.params.commentId}`);
                err.statusCode=404;
                next(err);
            }
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.delete(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next)=>{    
    Comments.findById(req.params.commentId)
    .then((comment)=>{
            if(comment != null ){
                if(!comment.author.equals(req.user._id)){
                    err = new Error(`you are not authorized to perform delete operation`);
                    err.statusCode=403;
                    next(err);
                }
                Comments.findByIdAndRemove(req.params.commentId)
                .then((resp)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(resp);
                },(err)=> next(err))
                .catch((err)=>{
                    next(err);
                });
            }else{
                err = new Error(`No comment present in database with id : ${req.params.commentId}`);
                err.status =404;
                next(err);
            }  
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
});


module.exports = commentRouter;