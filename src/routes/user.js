const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const SECRETKEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const router = express.Router();


router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        if (user) {
            const token = await user.generateToken();
            res.send({ user, token });
        } else {
            res.status(400).send('Error: Failed to login');
        }
    } catch (e) {
        console.log(e);
        res.status(400).send({error:'unable to login'});
    }
});

router.post('/user/logout',auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(token=>{
            return token.token !== req.token
        });
        await User.findByIdAndUpdate(req.user._id,{tokens:req.user.tokens});
        res.send("successfully logged out");
    }catch(e){   
        res.status(500).send();
    }
});

router.post('/user/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = [];
        await User.findByIdAndUpdate(req.user._id,{tokens:[]});
        res.send("Successfully logged out");
    }catch(e){     
        res.status(500).send();
    }
});

router.post('/user', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateToken();
        res.status(201).send({ user, token });
    } catch (err) {
        console.log(err);
        res.status(400).send('Error');
    }
});

router.get('/user/me', auth, async (req, res) => {
    
    res.send(req.user);
    
});

router.patch('/user/me', auth, async (req, res) => {
    const { id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update' });
    }
    try {
        if (!req.user) {
            res.status(404).send('data not found');
        } else {
            updates.forEach(update => {
                req.user[update] = req.body[update];
            });
            const user =new User(req.user);
            await user.save();
            res.send(user);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Error");
    }
});

router.delete('/user/me', auth, async (req, res) => {
    try {
        const user = new User(req.user);
        await user.remove();
        res.send();
    } catch (e) {
        res.status(500).send()
    }
});

const upload =multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'));
        }
        // cb(new Error('file must be a PDF'));
        cb(undefined,true);
        // cb(undefined,false);
    }
});

router.post('/user/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("Profile image uploaded successfully");
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});

router.delete('/user/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined;
    await req.user.save();
    res.send();
});

router.get('/user/:id/avatar',async (req,res)=>{
    try{
    const user = await User.findById(req.params.id);

    if(!user || !user.avatar){
        throw new Error();
    }
    res.set('Content-Type','image/png');
    res.send(user.avatar);
    }catch(e){
        res.status(404).send();
    }
});

module.exports = router;