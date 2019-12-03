//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({ // proper Mongoose schema not just a js objct
  email:String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']}); //no need to encrypt emails //plugin adds funcationality to schema here it gives encrytption power


const User = new mongoose.model("User",userSchema); //creating User collection which follows userSchema

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){

  // const email = app.body.req.username;
  // const password = app.body.req.password;
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets"); //secrets page renders only if reg is successful lvl-1
    }
  });

});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundUser){ //email:username -- checks email entered in the form against database
    if(err)
    {
      console.log(err);
    }
    else{
      if(foundUser){ //if user is found i.e email is present in db
        if(foundUser.password === password){ //password verification
          res.render("secrets"); //secrets page is rendered only if details match lvl-1
        }
      }
    }
  });
});





app.listen(3000,function(req,res){
  console.log("Server is running on port 3000");
});
