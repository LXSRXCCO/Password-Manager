const express = require("express");
const session = require("express-session");
const db = require("../database/db");
const bcrypt = require("bcrypt");
const path = require("path");
const router = express.Router();

const redirectLogin = (req, res, next) => {
    if(!req.session.userId){
        res.redirect("/login");
    } else {
        next();
    }
}

const redirectHome = (req, res, next) => {
    if(req.session.userId){
        res.redirect("/home");
    } else {
        next();
    }
}

router.post("/register", redirectHome, (req, res) => {
    const {name, email, password} = req.body;
    db.query("SELECT email FROM users WHERE email = ?", [email], async (err, user) => {
        if(err){
            return console.log(err);
        }

        if(user.length > 0){
            res.send(`
                <h1>Email Address already in use</h1>
                <a href = "/login">Login</a>
            `)
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query("INSERT INTO users SET ?", {name: name, email: email, password: hashedPassword}, (err, user) => {
            if(err){
                return console.log(err);
            } else {
                res.send(`
                    <h1>User Successfully Registered!</h1>
                    <a href = "/login">Login</a>
                `)
            }
        });
    })
});

router.post("/login", redirectHome, (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users where email = ?", [email], async (err, user) => {
        if(err){
            return console.log(err);
        } 

        if(!user || !(await bcrypt.compare(password, user[0].password))){
            res.send(`
                <h1>User Not Found</h1>
            `)
        } else {
            const id = user[0].id
            req.session.userId = id
            res.redirect("/home");
        }
    })
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if(err){
            return console.log(err);
        }
    })
    res.clearCookie(process.env.SESS_NAME);
    res.redirect("/");
})

module.exports = router;