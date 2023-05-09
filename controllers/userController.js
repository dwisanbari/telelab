const User = require("../models/user");
const bcrypt = require('bcrypt');

const UserController = {};

UserController.index = (req,res)=>{
    res.render("index",{});
}

UserController.login = (req,res)=>{
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  console.log(password);


  User.login(email, password, (err, user) => {
    if (err) {
      res.render("login", { message: err });
    } else {
      req.session.isLoggedIn = true;
      res.redirect("/home");
    }
  });
}

UserController.logout = (req, res) => {
    // hapus session user
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.render("error", { message: err.message });
        } else {
            console.log("User logged out");
            res.redirect("/");
        }
    });
};

UserController.register = (req,res)=>{
    User.allUsers((err,rows)=>{
        if(err){
            console.log(err);
            res.render("error",{message:err.message});
        } else {
            console.log(rows);
            res.render("register",{users:rows});
        }
    });
}

UserController.create = (req,res) => {
    
    const params = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10) // hash password dengan bcrypt
      };

    User.create(params,(err) => {
        if(err){
            console.log(err);
            res.render("error",{message:err.message});
        } else {
            console.log('New user added:', params);
            res.redirect("/");
        }
    });
}

UserController.home = (req,res)=>{    
    User.allData((err,rows)=>{
        if(err){
            console.log(err);
            res.render("error",{message:err.message});
        } else {
            console.log(rows);
            if(req.session.isLoggedIn){
                res.render("home",{data:rows});
            }else{
                res.send("Anda perlu login");
            }
        }
    });
}

module.exports = UserController;