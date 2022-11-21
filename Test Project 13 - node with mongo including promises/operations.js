// this file will contain all the database operation in node module

const assert = require('assert');

exports.insertDocument = (db,document,collection,callback)=>{

    const coll=db.collection(collection);
    /*  Not using the below code as mongo methods natively return promises so will utilize that instead 
        of supplying the callbacks by ourselves 
        We know that the node MongoDB driver natively supports promises.
        So, if you do not specify a callback, the calls to their functions will return promises.

        coll.insertOne(document,(err,result)=>{
        assert.equal(err,null);
        console.log(`inserted Document ${result.result.n} into the collection ${collection} `);
        callback(result);
    });
    
        when we are calling this function here, we are passing in the second parameter which is a callback 
        function here. So, because we're going to be using promises here. So I'm just going to delete that 
        callback function and then since this 
        call to the insert will anyway return promises, I'm just going to return the promise from this function

    */

    return coll.insertOne(document);
    
};

exports.findDocuments = (db,collection,callback)=>{
    const coll=db.collection(collection);
    return coll.find({}).toArray();

};

exports.removeDocument = (db,document,collection,callback)=>{
    const coll=db.collection(collection);
    return coll.deleteOne(document);

};

exports.updateDocument = (db,document,update,collection,callback)=>{
    const coll=db.collection(collection);
    return coll.updateOne(document,{$set : update},null);

};