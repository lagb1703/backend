"use strict";
const nodemailer = require("nodemailer");
const config = require("./config.json");

/*
* es un objeto que no ayudara a guardar las configuraciones para enviar un correo
*/
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, //puerto 465 para enviar correos
    secure: true, 
    auth: {
      user: config.email, // correo del que usara la aplicacion
      pass: config.dinamicPassword, // clave de aplicacion
    },
  });

/*
* string, string, string, string, string?, string?, string? => Promese
* envia un correo desde el correo de config al correo que se le indique en email
*/
function sendMail(adminName, adminEmail, email, subject="", text="", html="") {
    return transporter.sendMail({
        from: `"${adminName} <${adminEmail}>`, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
}
module.exports = sendMail;