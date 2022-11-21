const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url='mongodb://127.0.0.1:27017/';
const dbname = 'conFusion';



MongoClient.connect(url,(err,client)=>{
    assert.equal(err,null);
    console.log('Conected to the server');
   // console.log(client);

    const db=client.db(dbname);
    const collection = db.collection('dishes');


    console.log("value of db is" );
    console.log("value of collection is");
    console.log('BEFORE INSERT ONE METHOD');

    collection.insertOne({"name" : "pavbhaji","description" : "indian dish from north"},(err,result)=>{
        assert.equal(err,null);

        console.log('After insertion : \n');
        console.log(result.ops);
        //all document in collection will be returned to us as in find we have given empty {}
        collection.find({}).toArray((err,docs)=>{
            assert.equal(err,null);

            console.log('Results we got are : \n');
            console.log(docs);

            db.dropCollection('dishes',(err,result)=>{
                assert.equal(err,null);
                
                client.close();
            });
        });
    })
});

