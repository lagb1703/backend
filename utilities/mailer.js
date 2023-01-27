"use strict";
const nodemailer = require("nodemailer");

/*
* es un objeto que no ayudara a guardar las configuraciones para enviar un correo
*/
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, //puerto 465 para enviar correos
    secure: true, 
    auth: {
      user: "elpuntodelpollo2023@gmail.com", // correo del que usara la aplicacion
      pass: "zjlckycjcwbanrwi", // clave de aplicacion
    },
  });

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(admin, from, email, subject="", text="", html="") {
    await transporter.sendMail({
        from: `"${admin.nombre} <${admin.email}>`, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
}
module.exports = sendMail;