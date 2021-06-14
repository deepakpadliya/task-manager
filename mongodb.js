const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

const connectURL = 'mongodb+srv://deepak:D33p!@cluster0.i4nsj.mongodb.net/task-manager?retryWrites=true&w=majority';

mongoClient.connect(connectURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('unable to connect to databse', error);
    }
    console.log("Connected successfully");
    const db = client.db('task-manager');

    // db.collection('tasks').find({status:false}).toArray((error,result)=>{
    //     if(error) return console.log('unable to fetch record');
    //     console.log(result);
    // })

    // db.collection('users').updateOne({ name: 'Deepak' }, { $inc: { age: 2 } })
    //     .then(res => {
    //         console.log(res);
    //     }).catch(err => {
    //         console.log(err);
    //     });

    // db.collection('tasks').updateMany({ status: false }, { $set: { status: true } })
    //     .then(res => {
    //         console.log(res.modifiedCount);
    //     }).catch(err => {
    //         console.log(err);
    //     });

    db.collection('tasks').deleteMany({ status: true })
        .then(res => {
            console.log(res.modifiedCount);
        }).catch(err => {
            console.log(err);
        });

})