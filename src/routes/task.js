const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const Task = require('../models/Task');

router.post('/task',auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owoner:req.user._id
        });
        await task.save();
        res.send({task});
    } catch (err) {
        console.log(err);
        res.status(400).send({'Error:':err});
    }
});
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async(req, res) => {

    console.log("queryparams",req.query);
    try{
        const match ={},sort={};
        const query = req.query;
        if(query.completed){ match.completed = query.completed; }
        if(query.desc){
            // filter.desc = query.desc
            match.desc ={
                $regex: new RegExp("^"+ '.*' + query.desc.toLowerCase() + '.*',"i" )
            };
        }

        if(query.sortBy){
            const parts = query.sortBy.split(':');
            sort[parts[0]] = parts[1] ==='desc' ? -1:1;

        }
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(query.limit||0),
                skip:parseInt(query.skip||0),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send("Error");

    }
});

router.get('/task/:id', auth, async(req, res) => {

    const { id } = req.params;
    try{
        // const task = await Task.findById(id);
        const task = await Task.findOne({_id:id,owoner:req.user._id});
        if(!task){
            res.status(404).send('data not found');
        }else{
            res.send(task);
        }
    }catch(e){
        res.status(500).send("Error");
    }
});

router.patch('/task/:id',auth,async(req,res)=>{
    const { id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['desc','completed'];

    const isValidOperation = updates.every(update=>allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Update'});
    }
    try {
        console.log("data for update", req.body);
        const task = await Task.findOne({ _id: id, owoner: req.user._id });
        if (!task) {
            return res.status(404).send('data not found');
        }
        updates.forEach(update => {
            task[update] = req.body[update];
        });
        await task.save();

        console.log("updated successfully")
        res.send(task);

    }catch(e){
        console.log(e);
        res.status(500).send("Error");
    }
});

router.delete('/task/:id',auth,async(req,res)=>{
    try{
        const {id} = req.params;

        const task = await Task.findOneAndDelete({_id:id,owoner:req.user.id});

        if(!task){
            res.status(400).send('Task not found');
        }else{
            res.send(task);
        }
    }catch(e){
        res.status(500).send()
    }
});
module.exports=router;