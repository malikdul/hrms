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
  sendemail = new EmailSender();

  //Login 
  login = (req, res) => {

    this.model.findOne({'pinfo.email' : req.body.pinfo.email }, (err, user) => {
      if (err) {
        res.status(400).json({ message: 'Error Generated!' });
      }
      else if (user) {
        if (user.pinfo.verify == true) {
          if (user.pinfo.status == true) {
            if (user.pinfo.deleted == false) {
              user.comparePassword(req.body.pinfo.password, (error, isMatch) => {
                // console.log("pass",req.body.password);
                if (!isMatch) { return res.status(403).json({ message: 'Password Doesnot Match!' }); }
                const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
                //console.log("Sending token to user",token);
                res.status(200).json({ token: token });

              });
            } else {
              res.status(400).json({ message: 'Alert: Your Account has been Expelled ' });
            }
          } else {
            res.status(400).json({ message: 'Deactivated: Contact Admin to Active your account!' });
          }
        }
        else {
          res.status(400).json({ message: 'Message: Verify your account!' });
        }
      }
      else {
        res.status(400).json({ message: 'No user Found!' });
      }
    });
  }
  //sending mail
  sendregmail(emailuser) {
    let subject = 'Email Verification';
    // console.log("*********************"+emailuser);
    this.sendemail.sendmailregisteration(subject, emailuser)
  }


  //verifying user
  verify = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      //ser verify account to true;
      console.log('id:', req.params.id);
      user.verify = true;
      this.model.findById(req.params.id, (err, user) => {
        if (err) {
          res.status(500).send(err);
        } else {
          user.status = true;
          user.verify = true;
          console.log('verify boolean', user.verify);
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
    )
  };
  //verify email for resetpassword 
  resetpasswordverify = (req, res) => {
    // retrieve the password field
    var password = req.body.password;

    // update it with hash
    req.body.password = bcrypt.hashSync(password);
    console.log('password', req.body.password);
    this.model.findOneAndUpdate({ _id: req.body.id }, req.body, (err) => {
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
          user.verify = true;
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
    )
  };
  //send mail for resetpassword
  resetpasssendmail = (user) => {
    let subject = 'Reset Password';
    // console.log("*********************"+emailuser);
    this.sendemail.sendresetmail(subject, user)
  }

  //function override of insert 
  insert = (req, res) => {
    // console.log('Enter in isnert function');

    this.model.find({ 'pinfo.email': req.body.pinfo.email }, (err, userlist) => {
      //console.log('User got: ', userlist);
      if(userlist.length===1)
      {
        const user = userlist[0];
        if(user.deleted) {
          //console.log('user was deleted');
          user.pinfo = req.body.pinfo;
          user.pinfo.status = false;
          user.pinfo.verify = false;
          user.pinfo.deleted = false;
          //console.log('user.save ka function');
          user.save((err, user) => {
            if (err) {
              res.status(500).send(err)
            } else {
            //  console.log('user deleted added');
              this.sendregmail(user);
              res.sendStatus(200);
            }
          });
        }
        else{
          res.sendStatus(400);
        }
      }
      else{
        
        const user = new User(req.body);
        user.pinfo.status = false;
        user.pinfo.verify = false;
        user.pinfo.deleted = false;
        user.save((err, item) => {
          if (err && err.code === 11000) {
            console.log('error 11000');
            res.sendStatus(400);
          }
           if (err) {    
            return console.error(err);
          }
          this.sendregmail(user);
          res.status(200).json(item);
        });
      }
    });
  }


  // Get by email
  forgotpassword = (req, res) => {
    const user = new User(req.body);
    user.verify = false;
    console.log("recieved email" + req.body.email);
    this.model.findOne({ email: req.body.email }, (err, obj) => {
      console.log("forgot passwd:" + req.body.email);
      console.log("object passwd" + obj.email);
      if (obj.email == req.body.email) {
        //console.log("Email found!");
        res.status(200).json();
      }
      else if (err) { return console.error(err); }
      this.resetpasssendmail(obj);
      //res.json(obj);
    });
  }


}
