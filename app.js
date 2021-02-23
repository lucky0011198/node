require('dotenv').config();
const session = require('express-session')
const alert = require('alert');
const express = require('express');
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const register = require("./models/register");
const app = express();
const cookieParser = require("cookie-parser")
const auth = require("./middleware/auth");
require("./db/conn");
const templets_path = path.join(__dirname, "./Templets/views");
const partials_path = path.join(__dirname, "./Templets/partials");
const port = process.env.PORT || 2000;
app.set('view engine', '.hbs');
app.set("views", templets_path);
hbs.registerPartials(partials_path);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
console.log(process.env.SCRET_KEY);
app.get('/',auth,(req, res) => {
    //console.log(`my cookie is ${req.cookies.jwt}`);
    res.render("index");
})
app.get('/sec',auth,(req,res)=>{
    res.render("login");
})
app.set('trust proxy', 1);
app.use(session({
    secret: process.env.SCRET_KEY,
    resave: false,
    maxAge:10,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
app.get('/logout',auth, async(req,res)=>{
    try{
      req.user.tokens=[];
      console.log(req.user);
      res.clearCookie("jwt");
      res.clearCookie("connect.sid")
      alert("logout successfully");
      await req.user.save();
      res.render("login");
  }catch(error){
    res.render("error500");
      res.status(500).send(error);
  }
  })
app.get('/login', (req, res) => {
    res.render("login");
})
app.get('/profile',(req,res)=>{
    res.render("profile");
})
app.get('/register', (req, res) => {
     res.render("register");
})
app.post('/register', async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const reg = new register({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                roll: req.body.roll,
                password: password
            })
            console.log(reg)
            const token = await reg.generatetoken();
            const registerd = await reg.save();
            res.cookie("jwt",token ,{
                //expires :new Date(Date.now()+700000),
                httpOnly:true
            });
            console.log(cookie);
            res.status(201).render("index");
        } else {
            console.log("password are not matching");
        }
    } catch (error) {
        res.render("error400");
        res.status(400).send(error);
    }
})
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await register.findOne({ email: email });
        const psw =await bcrypt.compare(password,useremail.password);
        const token = await useremail.generatetoken();
        res.cookie("jwt",token ,{
            //expires :new Date(Date.now()+900000),
            httpOnly:true
        });
        if (psw){
            req.session.login = true;
            console.log(req.session.login);
            res.status(201).render("index");
        } else {
            res.render("psw");
            console.log("password are not matching")
        }

    } catch (error) {
        res.render("error400");
        res.status(400).send("invalid email");
    }
})
app.listen(port, () => {
    console.log("express is connected at 2000")
})
