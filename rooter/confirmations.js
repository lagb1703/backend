const router = require("express").Router();
const POOL = require("../utilities/sqlconection");
const CONFIG = require("../utilities/config.json");


/*
* Este endpoint sirve para la varificacion de usuario, se necita mejorar la seguridad
*/
router.get("/email",(s,r)=>{
    email = s.query.email;
    POOL.query("SELECT correo, nombre, contraseña, tipo FROM usuarios WHERE correo = '" + email + "' LIMIT 1").then((data)=>{
        if(!data[0][0]){
            r.send({password:""});
            return;
        }
        if(data[0][0].tipo == 1){
            data[0][0].password = CONFIG.password;
        }
        r.send(data[0][0]);
    }).catch((e)=>{
        console.log(e);
        r.send(e);
    });
});

module.exports = router;