const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    owoner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }, 
    desc:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

const Task = mongoose.model('Task',schema);
module.exports = Task;