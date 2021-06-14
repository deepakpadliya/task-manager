const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req,res,next)=>{
    try{
        console.log("auth middleware");
        var token = req.header('Authorization')
        token = token.replace("Bearer","").trim();
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findOne({_id:decode._id,'tokens.token':token});
        if(!user){
            console.log("user not found");
            throw new Error('Please Authenticate');
        }
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        console.log(e);
        res.status(401).send({error:'Please authenticate'});
    }
}
module.exports=auth;