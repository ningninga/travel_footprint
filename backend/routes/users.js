const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');


// register

router.post("/register", async (req, res) => {
    try{
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(req.body.password, salt);

     
        // create new user
        const newUser =  new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPwd,

        });

        // save user and send response
        const user = await newUser.save();
        res.status(200).json(user._id);

    }catch(err){
        res.status(500).json(err);
    }
})

//login
router.post("/login", async (req, res)=> {
    // find user
    const user = await User.findOne({username: req.body.username});
    !user && res.status(400).json("Wrong username or password!");

    // validate password
    const validPwd = await bcrypt.compare(req.body.password, user.password)
    ! validPwd && res.status(400).json("Wrong username or password!");

    // send response
    res.status(200).json({_id: user._id, username: user.username})
})

module.exports = router;
