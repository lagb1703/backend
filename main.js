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
* Routers
*/
/*para el sql del admin*/
app.use(require("./rooter/adminSql"));
/*para el sql del usuario*/
app.use(require("./rooter/userSql"));
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