const express = require('express');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const cors = require('./cors');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());




dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus =200;
})
.get(cors.cors,(req,res,next)=>{
    Dishes.find(req.query)
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
/*
 what does this do? This says that if a post request comes in, I would first execute this middleware,(authenticate.verifyUser) which I have exported from the authentic.js file, I first apply that, which is equivalent to saying passport authenticate JWT and you are checking the user. Then if this is successful, then I will move on to do the rest of it. If the authentication fails at this point, then passport authenticate will reply back to the client with the appropriate error message. So that is already handled by passport authenticate, so I don't have to worry anything beyond that point. If I have crossed this middleware and then get to execute the next function that means that my authentication was successful, so I'm able to proceed forward from this point. So, this is acting as the barrier for this post method
*/
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,( req,res,next)=>{
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
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
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
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus =200;
})
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
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
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);

})
.put(cors.corsWithOptions,authenticate.verifyUser ,authenticate.verifyAdmin,(req,res,next)=>{
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
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{    
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
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus =200;
})
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
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
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);
                    })
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
.put(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED on ${req.params.url}`);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
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
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus =200;
})
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
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
.post(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED on endpoint ${req.params.url} `);

})
.put(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        console.log("author 2 check ",dish.comments.id(req.params.commentId).author);
        console.log(req.user);
        console.log("user id is",req.user._id);
        console.log("condition check",(req.user._id).equals((dish.comments.id(req.params.commentId).author)));

        if((req.user._id).equals((dish.comments.id(req.params.commentId).author))){

            if(dish != null && dish.comments.id(req.params.commentId) != null ){
                if(req.body.rating ){
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.comment){
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save()
                .then((dish)=>{
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);
                    })          
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
        }else{
            err = new Error(`user with  id : ${req.user.id} is not allowed to update the comment as it was not posted by him`);
            err.statusCode=403;
            next(err);
        }
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
})
.delete(cors.corsWithOptions,authenticate.verifyUser ,(req,res,next)=>{    
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if((req.user._id).equals((dish.comments.id(req.params.commentId).author))){
            if(dish != null && dish.comments.id(req.params.commentId) != null ){
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then((dish)=>{
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);
                    })  
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
        }else{
            err = new Error(`user with  id : ${req.user.id} is not allowed to delete the comment as it was not posted by him`);
            err.status=403;
            next(err);
        }
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
});


module.exports = dishRouter;

// module.exports.Router=dishRouter;
