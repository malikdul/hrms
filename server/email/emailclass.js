"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require("nodemailer");
var ejs = require("ejs");
var fs = require("fs");
var EmailSender = (function () {
    function EmailSender() {
        var _this = this;
        this.sendmailregisteration = function (subject, obj) {
            //console.log("**** *****send mail registration*******"+obj.id);
            //console.log(obj.username);
            var verifylink = "http://localhost:4200/api/user/verifiedmail/" + obj.id;
            var mailOption = {
                to: obj.email,
                from: process.env.EMAIL_USER,
                subject: subject,
                html: _this.registrationEmailTemplate({ model: obj, verify: verifylink })
            };
            _this.transporter.sendMail(mailOption, function (error, info) {
                console.log('Error in send mail: ', error);
                if (error) {
                    // console.log('Sending mail error!');  
                    console.log(error);
                }
                else {
                    console.log('Message Sent' + info.response);
                }
            });
        };
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
    return EmailSender;
}());
exports.default = EmailSender;
//# sourceMappingURL=emailclass.js.map