const express = require('express');
require('dotenv').config()
require('./src/db/mongoose');
const UserRoute = require('./src/routes/user');
const TaskRoute = require('./src/routes/task');
const Task = require('./src/models/Task');
const User = require('./src/models/User');

const app = express();
const port = process.env.PORT || 3000;


const multer = require('multer');

const upload = multer({
    dest:'images',
    fileFilter:function(req,file,cb){
        if(!file.originalname.endsWith(".pdf")){
            return cb(new Error('Please upload a pdf'));
        }
        cb(undefined,true);
    }
});

app.post('/upload',  upload.single('upload'), (req,res)=>{
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});

app.use(express.json());



app.use((req,res,next)=>{
    if(req.method==='GET'){

    }else{
        
    }
    console.log(req.path);
    next();
})


app.use(UserRoute);

app.use(TaskRoute);

app.listen(port, () => {
    console.log('app is running on' + port);
});