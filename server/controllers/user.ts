import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import EmailSender from '../email/emailclass';

import * as bcrypt from 'bcryptjs';
import User from '../models/user';
import BaseCtrl from './base';
import express from 'express';
import * as nodemailer from 'nodemailer';
export default class UserCtrl extends BaseCtrl {
  model = User;
  sendemail = new EmailSender();

  //Login 
  login = (req, res) => {
    this.model.findOne({ 'pinfo.email': req.body.pinfo.email }, (err, user) => {
      if (err) {
        res.status(400).json({ message: 'Error Generated!' });
      }
      else if (user) {
        if (user.pinfo.verify == true) {
          if (user.pinfo.status == true) {
            if (user.pinfo.deleted == false) {
              user.comparePassword(req.body.pinfo.password, (error, isMatch) => {
                if (!isMatch) { return res.status(403).json({ message: 'Password Doesnot Match!' }); }
                const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
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
    this.sendemail.sendmailregisteration(subject, emailuser)
  }


  //verifying user
  verify = (req, res) => {
    let secret = new Buffer("12345678");
    let token = req.params.token;
    let decode = jwt.decode(token, secret);
    if (new Date(decode.expiry) > new Date()) {
      this.model.findOne({ _id: decode.data._id }, (err, user) => {
        if (!user) { return res.sendStatus(403); }
        user.pinfo.status = true;
        user.pinfo.verify = true;
        user.save((err, user) => {
          if (err) {
            res.status(500).send(err)
          }
          res.status(200).json('Yor Email has been verified!!!');
        });
      }
      )
    }
    else {
      console.log("Link is expired");
      res.json({ error: "Link is expired" });
    }
  };
  //verify email for resetpassword 
  resetpasswordverify = (req, res) => {
    var password = req.body.password;
    let secret = new Buffer("12345678");
    let token = req.body.token;
    let decode = jwt.decode(token, secret);
    if (new Date(decode.expiry) > new Date()) {
      this.model.findOne({ _id: decode.data._id }, (err, obj) => {
        obj.pinfo.password = password;
        obj.save((err, obj) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.sendStatus(200);
          }
        });
      });
    }
  }
  //send mail for resetpassword
  resetpasssendmail = (user) => {
    let subject = 'Reset Password';
    this.sendemail.sendresetmail(subject, user)
  }

  //function override of insert 
  insert = (req, res) => {

    this.model.find({ 'pinfo.email': req.body.pinfo.email }, (err, userlist) => {
      if (userlist.length === 1) {
        const user = userlist[0];
        if (user.deleted) {
          user.pinfo = req.body.pinfo;
          user.pinfo.status = false;
          user.pinfo.verify = false;
          user.pinfo.deleted = false;
          user.save((err, user) => {
            if (err) {
              res.status(500).send(err)
            } else {
              this.sendregmail(user);
              res.sendStatus(200);
            }
          });
        }
        else {
          res.sendStatus(400);
        }
      }
      else {

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
    console.log("recieved email" + req.body.email);
    this.model.findOne({ 'pinfo.email': req.body.email }, (err, obj) => {
      console.log("Object" + obj);
      console.log("object passwd" + obj.pinfo.email);
      if (obj.pinfo.email == req.body.email) {
        this.resetpasssendmail(obj);
        res.status(200).json();
      }
      else if (err) { return console.error(err); }
    });
  }


}
