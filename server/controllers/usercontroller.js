const router = require("express").Router();
// const { UniqueConstraintError } = require("sequelize/dist");
const {UserModel} = require("../models");
// const User = require("../models/user");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


router.post("/register", async (req, res) => {
    let { username, passwordhash } = req.body.user;
    try {
        const User = await UserModel.create({
            username,
            passwordhash: bcrypt.hashSync(passwordhash, 13),
        });

        let token = jwt.sign({id: User.id, username: User.username}, process.env.JWT_SECRET , {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already in use",
            });
        } else {
        res.status(500).json({
            message: "Failed to register user",
        });
    }
}
});

router.post("/login", async (req, res) => {
    let {username, passwordhash } = req.body.user;

    try {
    let loginUser = await UserModel.findOne({ // imported from const User
        where: {
            username: username,
        },
    });
    
    if (loginUser){
    let passwordComparison = await bcrypt.compare(passwordhash, loginUser.passwordhash);
    
    if (passwordComparison) {
    
    let token = jwt.sign({id: loginUser.id, username: loginUser.username, passwordhash: loginUser.passwordhash}, process.env.JWT_SECRET , {expiresIn: 60 * 60 * 24});
    
    res.status(200).json({
        user: loginUser,
        message: "User successfully logged in!",
        sessionToken : token
        });
    } else {
        res.status(401).json({
            message:"Incorrect username or password"
        })
    } 
    } 
    else {
        res.status(401).json({
            message: "Login failed",
        });
    }
    } catch (error) {
    res.status(500).json({
        message: "Failed to log user in"
    })
}
});

/*
    CRUD Notes
        Create --> POST (has body)
        Read --> GET (no body)
        Update --> PUT (has body)
        Delete --> DELETE (no body)
*/

module.exports = router;