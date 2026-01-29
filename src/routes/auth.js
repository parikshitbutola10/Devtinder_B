const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken"); 
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {
  try {

    validateSignUpData(req);

    const { firstname, lastname, emailid, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      emailid,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req,res) => {
  try{
    const { emailid, password} = req.body;

    const user = await User.findOne({emailid: emailid});
    if(!user) {
      throw new Error("Invalid Credentials");
    
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);

    if (isPasswordValid) {

      const token = await jwt.sign({_id: user._id},"abc");
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      
      res.send(user);
    } else {
      throw new Error("invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req,res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successful");
  });

module.exports = authRouter;