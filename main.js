const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();

/*
* setings
*/
app.set("port", process.env.PORT || 80);
app.set('trust proxy', true);

/*Midwares*/
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
/*
* Routers
*/
/*para el sql del admin*/
app.use(require("./rooter/adminSql"));
/*para el sql del usuario*/
app.use(require("./rooter/userSql"));
/*para buscar si existe un email*/
app.use(require("./rooter/confirmations"));
/*ruta para los pagos*/
app.use(require("./rooter/pay"));
/*
* midwere de ruta equivocada
*/
app.use((s,r)=>{
    r.send("no deberias estar aqui");
});
/*
* se prende el servidor
*/
app.listen(app.get("port"), ()=>{
    console.log("el demonio ha despertado en el puerto " + app.get("port"));
})