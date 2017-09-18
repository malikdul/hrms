import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import EmailSender from '../email/emailclass';
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

//Inserting New Record
  insert = (req, res) => {

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

}
