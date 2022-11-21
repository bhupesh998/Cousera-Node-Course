const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());


promoRouter.route('/')
.get((req,res,next)=>{
    Promotions.find({})
    .then((promotion)=>{
        if(promotion !=null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        }else{
            err= new Error('No promotion are there currently');
            err.statusCode = 404;
            next(err);
        }     
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.post(authenticate.verifyUser ,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.create(req.body)
    .then((promotion)=>{
        console.log('Promo created by post',promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.put(authenticate.verifyUser ,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);
})
.delete(authenticate.verifyUser ,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.remove({})
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


promoRouter.route('/:promoId')
.get((req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promotion)=>{
        if(promotion != null){
            console.log('promotion returned by promotion/promoid is  ',promotion);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        }else{
            err= new Error(`No promotion are there with id ${req.params.promoId}`);
            err.statusCode = 404;
            next(err);
        }     
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.post(authenticate.verifyUser ,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);

})
.put(authenticate.verifyUser ,authenticate.verifyAdmin,(req,res,next)=>{
   Promotions.findByIdAndUpdate(req.params.promoId,{
    $set : req.body },{ new : true})
    .then((promotion)=>{
        if(promotion != null){
            console.log('promotion updated by promotion/promoid is  ',promotion);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        }else{
            err= new Error(`No promotion are there with id ${req.params.promoId}`);
            err.statusCode = 404;
            next(err);
        }     
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{    
    Promotions.findByIdAndRemove(req.params.promoId)
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


module.exports=promoRouter;
