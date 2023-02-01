const router = require("express").Router();
const pool = require("../utilities/sqlconection");
const config = require("../utilities/config.json");

router.get("/sql", (s,r)=>{
    if(!s.query.tabla)
        r.sendStatus(404);
    else{
        /*se utilizara para guardar el selector que esta en el query*/
        let selector = s.query.selector;
        /*se utilizara para guardar la tabla que esta en el query*/
        let table = s.query.tabla;
        /*se guardara el where que esta en el query*/
        let where = s.query.where;
        /*se guardara el limit que esta en la query*/
        let limit = s.query.limit
        /*se hace la consulta*/
        console.log(`SELECT ${selector} from ${table} WHERE ${(where)?`(${where})`:"1"} ${(limit)?`LIMIT ${limit}`: ""}`);
        pool.query(`SELECT ${selector} from ${table} WHERE ${(where)?`(${where})`:"1"} ${(limit)?`LIMIT ${limit}`: ""}`).then((data)=>{
            r.send(data[0]);
        }).catch(()=>{
            console.log("ho no ha ocurrido un error");
            r.sendStatus(404);
        });
    }
});

router.post("/sql",(s,r)=>{
    if(!s.body.tabla){
        r.sendStatus(404)
        return;
    }
    if(s.body.password != config.password){
        r.sendStatus(203);
        return;
    }
    /*una expresion regular para saber si un string es un numero o no*/
    const regex = /^[0-9]*$/;
    /*aca se guardara las llaves del json que pasa el usuario*/
    let keys = Object.keys(s.body);
    /*aca se guardara los valores de las llaves de arriva*/
    let values = Object.values(s.body)
    /*aca se guardara la tabla a la cual se insertara*/
    let table = values.shift();
    values.shift();
    /*se igualan las dos tablas*/
    keys.shift();
    keys.shift();
    pool.query(`INSERT INTO ${table} (${keys.join(",")}) VALUES (${values.map((value)=>(regex.test(value)?value:`"${value}"`)).join(",")})`).then((res)=>{
        console.log("insercion de datos lista");
        r.send(res);
    }).catch((res)=>{
        console.log(res);
        r.send(res).sendStatus(400);
    })
});

router.delete("/sql",(s,r)=>{
    if(!s.body.tabla || !s.body.id){
        r.sendStatus(404)
        return;
    }
    if(s.body.password != config.password){
        r.sendStatus(203);
        return;
    }
    /*aca se guardara la tabla a la cual se insertara*/
    let table = s.body.tabla;
    /*aca se guardara el id del producto o usuario*/
    let id = s.body.id;
    pool.query(`DELETE FROM ${table} WHERE (id = ${id})`).then((res)=>{
        console.log("Eliminacion lista");
        r.send(res);
    }).catch((res)=>{
        console.log(res);
        r.send(res).sendStatus(400);
    })
});

router.patch("/sql",(s,r)=>{
    if(!s.body.tabla || !s.body.id){
        r.sendStatus(404)
        return;
    }
    if(s.body.password != config.password){
        r.sendStatus(203);
        return;
    }
    /*una expresion regular para saber si un string es un numero o no*/
    const regex = /^[0-9]*$/;
    /*aca se guardara las llaves del json que pasa el usuario*/
    let keys = Object.keys(s.body);
    /*aca se guardara los valores de las llaves de arriva*/
    let values = Object.values(s.body)
    /*aca se guardara la tabla*/
    let table = values.shift();
    values.shift();
    keys.shift();
    keys.shift();
    /*aca se guardara el id*/
    let id = s.body.id;
    pool.query(`UPDATE ${table} SET ${keys[0]} = ${regex.test(values[0])?values[0]:`"${values[0]}"`} where id = ${id}`).then((res)=>{
        console.log("producto cambiado");
        r.send(res);
    }).catch((res)=>{
        console.log(res);
        r.send(res).sendStatus(400);
    })
});

router.put("/sql",(s,r)=>{
    if(!s.body.tabla || !s.body.id){
        r.sendStatus(404)
        return;
    }
    if(s.body.password != config.password){
        r.sendStatus(203);
        return;
    }
    /*una expresion regular para saber si un string es un numero o no*/
    const regex = /^[0-9]*$/;
    /*aca se guardara las llaves del json que pasa el usuario*/
    let keys = Object.keys(s.body);
    /*aca se guardara los valores de las llaves de arriva*/
    let values = Object.values(s.body)
    /*aca se guardara la tabla*/
    let table = values.shift();
    values.shift();
    keys.shift();
    keys.shift();
    /*aca se guardara el id*/
    let id = values.pop();
    keys.pop();
    console.log(`UPDATE ${table} SET ${keys.map((key, i)=>{return `${key} = ${regex.test(values[i])?values[i]:`"${values[i]}"`}`}).join(", ")} where id = ${id}`);
    pool.query(`UPDATE ${table} SET ${keys.map((key, i)=>{return `${key} = ${regex.test(values[i])?values[i]:`"${values[i]}"`}`}).join(", ")} where id = ${id}`).then((res)=>{
        console.log("producto cambiado");
        r.send(res);
    }).catch((res)=>{
        console.log(res);
        r.send(res).sendStatus(400);
    })
});

module.exports = router;