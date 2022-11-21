const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url='mongodb://127.0.0.1:27017/';
const dbname = 'conFusion';



MongoClient.connect(url,(err,client)=>{
    assert.equal(err,null);
    console.log('Conected to the server');
    

    const db=client.db(dbname);

    
    dboper.insertDocument(db,{ name:"ab",description:"test"},'dishes',(result)=>{
        console.log(`TEST 2 : inserted document ${JSON.stringify(result.ops)}`);
        
        dboper.findDocuments(db,'dishes',(docs)=>{
            console.log("found documents ",docs);

            dboper.updateDocument(db,{name : "ab"},{"description" : "dish from nowhere"},'dishes',(result)=>{
                console.log("updated document", result.result);

                dboper.findDocuments(db,'dishes',(docs)=>{
                    console.log("found updated documents" , docs);

                    db.dropCollection('dishes',(result)=>{
                        console.log("dropped collection ",result);

                        client.close();
                    });

                    
                });

            });

        });
    });
 

});

