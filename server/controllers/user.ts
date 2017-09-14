import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import BaseCtrl from './base';
import express from 'express';
import * as nodemailer from 'nodemailer';
const router= require('express').Router();
export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if(err){ 
        res.status(400).json({message:'Error Generated!'});
      }
      else if (user) {
      if(user.verify==true){
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.status(403).json({message:'Password Doesnot Match!'}); }
        const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        //console.log("Sending token to user",token);
        res.status(200).json({ token: token });
        });
      } 
      else{
        res.status(400).json({message:'Message: Verify your account!'});     
      }
    }
    else{
      res.status(400).json({message:'No user Found!'});
    }
  } );
  }
  verify = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      //ser verify account to true;
      user.verify = true;
      this.model.findById(req.params.id, (err, user) => {  
        if (err) {
            res.status(500).send(err);
        } else {
            user.verify=true;
            // Save the updated document back to the database
            user.save((err, user) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).json('Message: Email Verified. Now You Can Log into Your Account!');
            });
        }
    });
  }
      )};


  sendmail= (email: string,id: string,name: string) =>{
    //router.post('/send ', function(req, res, next) { 
    var transporter= nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'fmalvi12@gmail.com',
          pass: 'farmo@1212'
        }
      });

      let mailOption: nodemailer.SendMailOptions= {
        to: email,
        from:'fmalvi12@gmail.com' ,
        subject: 'Verification Email',
        html: 'Welcome "+name+"!<br><br>Thanks for registering your account on our site.<br><br>We hope you enjoy your experience.<br><br>Please follow the link below to verify your account:<br><br>http://localhost:4200/api/user/verify/'+id
      };
      
      transporter.sendMail(mailOption,function(error,info){
        console.log(error);
        if(error){
          console.log(error);
        }else{
          console.log('Message Sent'+info.response);
        }
      });
    //});
  }


  insert = (req, res) => {
    const user = new User(req.body);
    user.verify=false;
    user.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      this.sendmail(req.body.email,user.id,req.body.username);
      res.status(200).json(item);
    });
   
  }

}
