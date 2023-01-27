const express = require("express");
const bodyParser = require('body-parser');
const app = express();

/*
* setings
*/
app.set("port", process.env.PORT || 80);
app.set('trust proxy', true);

/*Midwares*/
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

/*
* 
*/
app.use
app.listen(app.get("port"), ()=>{
    console.log("el demonio a despertado");
})