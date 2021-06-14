const User = require('./models/User');

require('../src/db/mongoose');

User.findOneAndUpdate('60b8ccc26af59230cfb36461',{age:24}).then(user=>{
    console.log(user);
    return User.countDocuments({age:19}).then(count=>{
        console.log(count);
    }).catch(err=>{
        console.log("Error in counting document");
    })
}).catch(err=>{
    console.log("Error in updating document");
})