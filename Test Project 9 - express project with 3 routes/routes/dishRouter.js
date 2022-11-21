const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());



dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    
    next();
})
.get((req,res,next)=>{
    res.end(`all dishes will be served on frontend in some time`);
})
.post((req,res,next)=>{
    
    res.end(` dish added : ${req.body.name} - ${req.body.description}`);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);
})
.delete((req,res,next)=>{
    res.end(`deleting all the dishes `);
});


dishRouter.route('/:dishId')
.get((req,res,next)=>{
    res.end(` dish ${req.params.dishId} will be served on frontend in some time`);
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);

})
.put((req,res,next)=>{
    res.write(`updating dish : ${req.params.dishId}`);
    res.end(`
            Dish with id:  ${req.params.dishId} updated ${req.body.name}
            `);
})
.delete((req,res,next)=>{    
    res.write(`deleting dish : ${req.params.dishId} \n`);
    res.end(`Dish with id given :  ${req.params.dishId} deleted -  ${req.body.name}`);
});

module.exports = dishRouter;

// module.exports.Router=dishRouter;
