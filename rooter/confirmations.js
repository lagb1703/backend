const router = require("express").Router();
const pool = require("../utilities/sqlconection");

router.get("/email",(s,r)=>{
    email = s.query.email;
    pool.query("SELECT correo, nombre, contraseña, tipo imagenes FROM usuarios WHERE correo = '" + email + "' LIMIT 1").then((data)=>{
        if(!data[0][0]){
            r.send({password:""});
            return;
        }
        if(data[0][0].tipo == 1){
            data[0][0].password = config.password;
            return;
        }

        r.send(data[0][0]);
    }).catch((e)=>{
        console.log(e);
        r.send(e);
    });
});

router.get("/existUser", (s,r)=>{
    if(!s.query.nombre)
        r.sendStatus(404);
    else{
        /*se hace la consulta*/
        pool.query(`SELECT nombre, contraseña from usuarios WHERE nombre = ${s.query.nombre}`).then((data)=>{
            if(data[0][0].tipo == 1){
                data[0][0].password = config.password;
                return;
            }
            r.send(data[0]);
        }).catch(()=>{
            console.log("ho no ha ocurrido un error");
            r.sendStatus(404);
        });
    }
})

module.exports = router;