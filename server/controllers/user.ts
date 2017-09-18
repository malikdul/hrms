import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import EmailSender from '../email/emailclass';

import * as bcrypt from 'bcryptjs';
import User from '../models/user';
import BaseCtrl from './base';
import express from 'express';
import * as nodemailer from 'nodemailer';
//const router= require('express').Router();
export default class UserCtrl extends BaseCtrl {
  model = User;
  sendemail=new EmailSender();
  
  //Login 
  login = (req, res) => {
    
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if(err){ 
        res.status(400).json({message:'Error Generated!'});
      }
      else if (user) {
      if(user.verify==true){
      user.comparePassword(req.body.password, (error, isMatch) => {
       // console.log("pass",req.body.password);
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
//sending mail
  sendregmail(emailuser){
    let subject= 'Email Verification';
   // console.log("*********************"+emailuser);
    this.sendemail.sendmailregisteration(subject,emailuser)
  }


//verifying user
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
                  //  console.log('Responce Sent!');
                res.status(200).json('Yor Email has been verified!!!');
            });
        }
    });
  }
      )};
      //verify email for resetpassword 
      resetpasswordverify = (req, res) => {
        // retrieve the password field
        var password = req.body.password;

        // update it with hash
        req.body.password = bcrypt.hashSync(password);     
        console.log(req.body.password);
        this.model.findOneAndUpdate({ _id: req.body.id}, req.body, (err  ) => {
          
          //console.log(req.body.password);
          if (err) { return console.error(err); }
          res.sendStatus(200);
        });
      }
//reset password 
resetpassword = (req, res) => {
  this.model.findOne({ _id: req.params.id }, (err, user) => {
    console.log("Enter in resetpassword method");
    if (!user) { return res.sendStatus(403); }
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
              res.status(200).json('Message: Password Reset. Now You Can Log into Your Account!');
          });
      }
  });
}
    )};
//send mail for registration
  sendmail= (email: string,id: string,name: string) =>{
    //router.post('/send ', function(req, res, next) { 
      console.log('Enter in send mail function');
    var transporter= nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'kaabtahir786@gmail.com',
          pass: 'kaab1996'
        }
      });

      let mailOption: nodemailer.SendMailOptions= {
        to: email,
        from:'kaabtahir786@gmail.com' ,
        subject: 'Verification Email',
        html: 'Welcome '+name+'!<br><br>Thanks for registering your account on our site.<br><br>We hope you enjoy your experience.<br><br>Please follow the link below to verify your account:<br><br>http://localhost:4200/api/user/verify/'+id
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
  //send mail for resetpassword
  resetpasssendmail= (email: string,id: string,name: string) =>{
    console.log("Enter into reset password function");
    //router.post('/send ', function(req, res, next) { 
    var transporter= nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'kvhrmsteam@gmail.com',
          pass: 'team1234'
        }
      });

      let mailOption: nodemailer.SendMailOptions= {
        to: email,
        from:'kvhrmteam@gmail.com' ,
        subject: 'Reset Password Email',
        html: 'Welcome '+name+'!<br><br>You requested for password reset.<br><br>Please follow the link below to Reset your account Password:<br><br>http://localhost:4200/resetpassword/'+id
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

//function override of insert 
  insert = (req, res) => {
    console.log('Enter in isnert function');
    const user = new User(req.body);
     user.verify=false;
       user.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        console.log('Insertion Error: ', req);        
        return console.error(err);
      }
      this.sendregmail(user);
      res.status(200).json(item);
    });
   
  }

   // Get by email
   forgotpassword = (req, res) => {
    const user = new User(req.body);
    user.verify=false;
    console.log("recieved email"+ req.body.email);
    this.model.findOne({ email: req.body.email }, (err, obj) => {
    console.log("forgot passwd"+ req.body.email);
    console.log("object passwd"+ obj.email);
      if(obj.email == req.body.email){
        //console.log("Email found!");
        res.status(200).json();
      }
      else if (err) { return console.error(err); }
      this.resetpasssendmail(req.body.email,obj.id,obj.username);
      //res.json(obj);
    });
  }


}
