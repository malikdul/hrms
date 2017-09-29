import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as jwt from 'jwt-simple';

export default class EmailSender {
  private registrationEmailTemplate: Function;
  private resetPasswordEmailTemplate: Function;
  private transporter: nodemailer.Transporter;
  info = {
    data: String,
    expiry: new Date
  };
  secret = new Buffer("12345678");
  token;
  constructor() {

    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    this.registrationEmailTemplate = ejs.compile(fs.readFileSync(__dirname + '/templates/registration_email.ejs').toString());
    this.resetPasswordEmailTemplate = ejs.compile(fs.readFileSync(__dirname + '/templates/resetpassword_email.ejs').toString());

  }

  sendmailregisteration = (subject: string, obj) => {
    this.info.data = obj;
    this.info.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    this.token = jwt.encode(this.info, this.secret);

    let verifylink = "http://localhost:4200/api/user/verifiedmail/" + this.token;
    let mailOption: nodemailer.SendMailOptions = {
      to: obj.pinfo.email,
      from: process.env.EMAIL_USER,
      subject: subject,
      html: this.registrationEmailTemplate({ model: obj, verify: verifylink })
    };

    this.transporter.sendMail(mailOption, function (error, info) {
      console.log('Error in send mail: ', error);
      if (error) {
        console.log('Sending mail error!');
        console.log(error);
      } else {
        console.log('Message Sent' + info.response);
      }
    });
  }

  sendresetmail = (subject: string, obj) => {
    this.info.data = obj;
    this.info.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    this.token = jwt.encode(this.info, this.secret);

    let verifylink = "http://localhost:4200/resetpassword/" + this.token;
    let mailOption: nodemailer.SendMailOptions = {
      to: obj.pinfo.email,
      from: process.env.EMAIL_USER,
      subject: subject,
      html: this.resetPasswordEmailTemplate({ model: obj, verify: verifylink })
    };

    this.transporter.sendMail(mailOption, function (error, info) {
      console.log('Error in send mail: ', error);
      if (error) {
        console.log('Sending mail error!');
        console.log(error);
      } else {
        console.log('Message Sent' + info.response);
      }
    });
  }
}