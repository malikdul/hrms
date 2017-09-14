import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  }

   // Get by email
   forgotpassword = (req, res) => {
    //console.log("recieved email"+ req.body.email);
    this.model.findOne({ email: req.body.email }, (err, obj) => {
  // console.log("forgot passwd"+ req.body.email);
    //console.log("object passwd"+ obj.email);
      if(obj.email == req.body.email){
        //console.log("Email found!");
        res.status(200).json();
      }
      else if (err) { return console.error(err); }
      //res.json(obj);
    });
  }


}
