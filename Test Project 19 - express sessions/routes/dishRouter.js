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

dishRouter.route('/:dishId/comments')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
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
.post((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null){
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
            },(err)=> next(err));
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
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED on ${req.params.url}`);
})
.delete((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null){
            for(let i=(dish.comments.length)-1;i>=0;i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            
        },(err)=> next(err));
        }else{
            err = new Error(`No dish present in database with id : ${req.params.dishId}`);
            err.statusCode=404;
            next(err);
        }
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
});


dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentId) != null ){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        }else if(dish == null ){
            err = new Error(`No dish present in database with id : ${req.params.dishId}`);
            err.statusCode=404;
            next(err);
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
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED on endpoint ${req.params.url} `);

})
.put((req,res,next)=>{
   Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentId) != null ){
           if(req.body.rating ){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
           }
           if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment;
           }
           dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            
        },(err)=> next(err));
        }else if(dish == null ){
            err = new Error(`No dish present in database with id : ${req.params.dishId}`);
            err.statusCode=404;
            next(err);
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
.delete((req,res,next)=>{    
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentId) != null ){
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            
            },(err)=> next(err));
        }else if(dish == null ){
            err = new Error(`No dish present in database with id : ${req.params.dishId}`);
            err.statusCode=404;
            next(err);
        }else{
            err = new Error(`No comment present in database with id : ${req.params.commentId}`);
            err.statusCode=404;
            next(err);
        }
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
});


module.exports = dishRouter;

// module.exports.Router=dishRouter;
