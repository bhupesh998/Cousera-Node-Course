const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url='mongodb://127.0.0.1:27017/';
const dbname = 'conFusion';



MongoClient.connect(url).then((client)=>{
    
    console.log('Conected to the server');
    
    const db=client.db(dbname);

    dboper.insertDocument(db,{ name:"ab",description:"test"},'dishes')
    .then((result)=>{
        console.log(` Inserted document \n ${JSON.stringify(result.ops)}`);
        
       return dboper.findDocuments(db,'dishes');
    })
    .then((docs)=>{
        console.log(`found documents in database \n  ${JSON.stringify(docs)}`);

        return dboper.updateDocument(db,{name : "ab"},{"description" : "dish from nowhere"},'dishes');
    })
    .then((result)=>{
        console.log(`updated Dcument are : \n ${JSON.stringify(result.result)}`);

        return dboper.findDocuments(db,'dishes')
    })
    .then((docs)=>{
        console.log(`found documents in database \n  ${JSON.stringify(docs)}`);

        return db.dropCollection('dishes');
    })
    .then((result)=>{
        console.log(`dropped collection \n ${JSON.stringify(result)} result`);

        client.close();
    }).catch((err)=>console.log(err));
                
}).catch((err)=>console.log(err));


