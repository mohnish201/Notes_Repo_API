const express = require("express");
const { UserModel } = require("../model/userModel");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PassCheck } = require("../middleware/validate");
const { BListModel } = require("../model/blackList");
const UserRouter = express.Router();

UserRouter.post("/register", PassCheck, async (req, res) => {
  const { pass, email } = req.body;
  const user = await UserModel.findOne({ email });

  if (user) {
    res.json("Already have Account");
  } else {
    try {
      bcrpyt.hash(pass, 5, async (err, hash) => {
        if (err) {
          res.send(err);
        } else {
          const NewUser = new UserModel({ ...req.body, pass: hash });
          await NewUser.save();
          res.send({ msg: "New User has been Registered", NewUser });
        }
      });
    } catch (error) {
      res.send(error);
    }
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrpyt.compare(pass, user.pass, async (err, result) => {
        if (result) {
          const token = jwt.sign(
            { userId: user._id, user: user.username },
            "masai",
            { expiresIn: "2d" }
          );
          res.send({ msg: "Login Successfull", token });
          setTimeout(async () => {
            const Blist = new BListModel({ token });
            await Blist.save();
          }, 1000 * 60 * 10);
        } else {
          res.send({ msg: "Wrong Credentials" });
        }
      });
    } else {
      res.send({ msg: "Wrong Credentials" });
    }
  } catch (error) {
    res.send(error);
  }
});

UserRouter.post("/logout", async (req, res) => {
  const { token } = req.body;


  try {
    if(token){
      const Blist = new BListModel({ token });
      await Blist.save();
      res.send('Logged out Successfully')
    }
    else{
      res.send("Token is undefined")
    }
  } catch (error) {
    res.send(error)
  }
 
});

module.exports = {
  UserRouter,
};
