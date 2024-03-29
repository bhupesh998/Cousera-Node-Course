const express = require('express');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());



dishRouter.route('/')
.get((req,res,next)=>{
    Dishes.find({})
    .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.post((req,res,next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish created by post',dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
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
    Dishes.remove({})
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


dishRouter.route('/:dishId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        console.log('Dish returned by get specific is  ',dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
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
   Dishes.findByIdAndUpdate(req.params.dishId,{
    $set : req.body },{ new : true})
    .then((dish)=>{
        console.log('Updated dish value is \n ',dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.delete((req,res,next)=>{    
    Dishes.findByIdAndRemove(req.params.dishId)
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



module.exports = dishRouter;

// module.exports.Router=dishRouter;
