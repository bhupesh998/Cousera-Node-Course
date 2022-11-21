const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());



promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end(`all prmotions will be sent on frontend in some time`);
})
.post((req,res,next)=>{
    res.end(` Promotions added : ${req.body.name} - ${req.body.description}`);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED for /promotions url endpoint `);
})
.delete((req,res,next)=>{
    res.end(`deleting all the promotions  `);
});


promoRouter.route('/:promoId')
.get((req,res,next)=>{
    res.end(` Promotions ${req.params.promoId} will be sent on frontend in some time`);
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED supported on this endpoint`);

})
.put((req,res,next)=>{
    res.write(`updating Promotions : ${req.params.promoId} \n `);
    res.end(`Promotions with id:  ${req.params.promoId} updated ${req.body.name} `);
})
.delete((req,res,next)=>{    
    res.write(`deleting Promotion : ${req.params.promoId} \n`);
    res.end(`Promotion with id given :  ${req.params.promoId} deleted -  ${req.body.name}`);
});







module.exports=promoRouter;
