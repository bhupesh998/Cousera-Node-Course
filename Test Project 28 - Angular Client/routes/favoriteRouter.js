const express = require('express');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const Favorites = require('../models/favorites');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
    Favorites.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    }); 
})
.post(authenticate.verifyUser,(req,res,next)=>{
    /* Favorites.findOneAndUpdate({user:req.user._id},{$addToSet :{dishes:req.body}},{
        new:true,
        upsert:true})
    .populate('user')
    .then((favorites)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });  */
    Favorites.findOne({user:req.user._id})
    .then((favorites)=>{
        if(favorites != null){
            console.log(req.body);
            console.log("length is",req.body.length);
            console.log(req.body[0]._id);
            for(var i=0;i<req.body.length;i++){
                console.log("index of value with id function is",favorites.dishes.indexOf(favorites.dishes.id(req.body[i])) );
                if(favorites.dishes.indexOf(favorites.dishes.id(req.body[i])) === -1){
                    favorites.dishes.push(req.body[i]._id);
                }              
            }
                favorites.save()
                .then((favorites)=>{
                    console.log(favorites);
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorites);
                },(err)=> next(err))
                .catch((err)=>{
                    next(err);
                });  
        }else{
            Favorites.create({user:req.user._id})
            .then((favorites)=>{
                console.log("else favorite value is",favorites);
                console.log("request body in else is",req.body);
                console.log("request body for 0 index is ",req.body[0]);
                console.log("length is",req.body.length);   
                for(var i=0;i<req.body.length;i++){
                    favorites.dishes.push(req.body[i]._id);   
                }
                favorites.save()
                .then((favorites)=>{
                    console.log(favorites);
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorites);
                },(err)=> next(err))
                .catch((err)=>{
                    next(err);
                }); 
            },(err)=> next(err))
            .catch((err)=>{
                next(err);
            }); 
        }   
    })
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    console.log("in delete method");
    Favorites.deleteMany({user : req.user._id})
    .then((favorites)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    }); 
});


favoriteRouter.route('/:dishId')
.get(authenticate.verifyUser, (req,res,next)=>{
        Favorites.findOne({user:req.user._id})
        .then((favorites)=>{
            if(!favorites){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                return res.json({"exists":false,"favorites":favorites});
            }else{
                if(favorites.dishes.indexOf(req.params.dishId)< 0){
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    return res.json({"exists":false,"favorites":favorites});
                }else{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    return res.json({"exists":true,"favorites":favorites});
                }
            }

        },(err)=> next(err))
        .catch((err)=>{
            next(err);
        }); 
})
.post(authenticate.verifyUser,(req,res,next)=>{
    console.log("req.params.dishId",req.params.dishId);
    Favorites.findOne({user:req.user._id})
    .then((favorites)=>{
        if(favorites != null){
            console.log("id function value is",favorites.dishes.id(req.params.dishId));

            console.log("index of value with id function is",favorites.dishes.indexOf(favorites.dishes.id(req.params.dishId)) )

           /*  const isFound = favorites.dishes.some(element => {
                console.log("element is" ,element._id);
                if (element._id === favorites.dishes.id(req.params.dishId)) {
                  return true;
                }
                return false;
              });

              console.log("value of isFound is ", isFound); */

            if(favorites.dishes.indexOf(favorites.dishes.id(req.params.dishId)) === -1) {
                favorites.dishes.push(req.params.dishId);
                console.log(favorites);
                favorites.save()
                .then((favorites)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorites);
                },(err)=> next(err))
                .catch((err)=>{
                    next(err);
                }); 
            }else{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json('item already present in the favorites list');
            }   
        }else{
            Favorites.create({user:req.user._id})
            .then((favorites)=>{
                console.log("else favorite value is",favorites);
                favorites.dishes.push(req.params.dishId);
                console.log(favorites);
                favorites.save()
                .then((favorites)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorites);
                },(err)=> next(err))
                .catch((err)=>{
                    next(err);
                }); 
            },(err)=> next(err))
            .catch((err)=>{
                next(err);
            }); 
        }     
})
    /*
    Favorites.findOneAndUpdate({user:req.user._id},{},{
        new:true,
        upsert:true})
    .populate('user')
    .then((favorites)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });  
    */
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOneAndUpdate({ user:req.user._id },{ $pull: { dishes: { _id: req.params.dishId} } },
    { new: true })
    .then((favorites)=>{
        console.log(favorites);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    }); 
});


module.exports = favoriteRouter;
