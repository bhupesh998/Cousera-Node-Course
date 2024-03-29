// this file will contain all the database operation in node module

const assert = require('assert');

exports.insertDocument = (db,document,collection,callback)=>{

    const coll=db.collection(collection);
    coll.insertOne(document,(err,result)=>{
        assert.equal(err,null);
        console.log(`inserted Document ${result.result.n} into the collection ${collection} `);
        callback(result);
    });
};

exports.findDocuments = (db,collection,callback)=>{
    const coll=db.collection(collection);
    coll.find({}).toArray((err,docs)=>{
        assert.equal(err,null);
        callback(docs);
    });

};

exports.removeDocument = (db,document,collection,callback)=>{
    const coll=db.collection(collection);
    coll.deleteOne(document,(err,result)=>{
        assert.equal(err,null);
        console.log(`deleted document : ${document}`);
        callback(result);
    });

};

exports.updateDocument = (db,document,update,collection,callback)=>{
    const coll=db.collection(collection);
    coll.updateOne(document,{$set : update },null,(err,result)=>{
        assert.equal(err,null);
        console.log(`TEST : updated document with ${JSON.stringify(update)} values `);
        callback(result);
    });
};