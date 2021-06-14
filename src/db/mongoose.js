const mongoose = require('mongoose');

const connectURL = process.env.MONGODB_URL;

mongoose.connect(connectURL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
},(err)=>{
    if(err){
        console.log("unable to connect to mongo db");
    }else{
        console.log("Connected to Database");
    }
});



// const user = new User({name:'Deepak Padliya   ',email:'   deepak@gmail.com    ',age:24,password:'    fd            '});

// user.save().then(res=>{
//     console.log(res);
// }).catch(err=> console.log(err));



// const task = new Task({desc:'description of task'});

// task.save().then(res=>{
//     console.log(res);
// }).catch(err=> console.log(err));