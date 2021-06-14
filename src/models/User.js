const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
const Task = require('./Task');

const SECRETKEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const schema = new mongoose.Schema({
    name:{type:String,trim:true,},
    email:{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){ throw new mongoose.Error('Email is invalid')}
        }
    },
    age:{
        type:Number,
        validate(value){
            if(value<0){
                throw new mongoose.Error('Age must be a positive number');
            }
        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:7,
        validate(value){
             if(value.toLowerCase().includes('password')){
                throw new mongoose.Error('value can\'t be password');
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
});

schema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owoner'
});

schema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
        console.log('yes')
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

schema.pre('remove',async function(next){
    const user = this;
    await Task.deleteMany({owoner:user._id});
    next();
});

schema.methods.toJSON = function(){
    const user = this;
    let userObject= user.toObject();
    delete userObject.tokens;
    delete userObject.password;
    delete userObject.avatar;
    return userObject;
}

schema.methods.generateToken = async function(){
    const user =this;
    const token = jwt.sign({_id:user._id.toString()},SECRETKEY);
    user.tokens=user.tokens.concat({token});
    await user.save();
    return token;
}
schema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email});

    if(!user){
        throw new Error('user not found');
    }
    console.log(password+"                        "+user.password);
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error('password did\t match');
    }

    return user;
}

const User = mongoose.model('User',schema);

module.exports = User;