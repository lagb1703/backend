const router = require("express").Router();
const pool = require("../utilities/sqlconection");
const config = require("../utilities/config.json");

router.get("/email",(s,r)=>{
    email = s.query.email;
    pool.query("SELECT correo, nombre, contraseña, tipo FROM usuarios WHERE correo = '" + email + "' LIMIT 1").then((data)=>{
        if(!data[0][0]){
            r.send({password:""});
            return;
        }
        if(data[0][0].tipo == 1){
            data[0][0].password = config.password;
        }
        r.send(data[0][0]);
    }).catch((e)=>{
        console.log(e);
        r.send(e);
    });
});

module.exports = router;