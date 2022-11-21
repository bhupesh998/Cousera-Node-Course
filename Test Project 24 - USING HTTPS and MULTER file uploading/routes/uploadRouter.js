const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer=require('multer');

const storage=multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null , 'public/images');
    },
    filename :(req,file,cb)=>{
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('the file is not an imahge '),false);
    }
        cb(null,true);
    

};

const upload = multer({ storage :storage , fileFilter : imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,upload.single('imageFile') ,(req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file);
})
.put(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);
});

module.exports = uploadRouter;