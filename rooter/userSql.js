const router = require("express").Router();
const POOL = require("../utilities/sqlconection");
const CONFIG = require("../utilities/CONFIG.json");
const ShoppingCart = require("../utilities/ShoppingCart")
const sendMail = require("../utilities/mailer");

let cart = new ShoppingCart();/*cart se utilizara para la reserva de productos*/

/*
* este endpoint se utiliza para obtener todos los productos disponibles, recuerda muestra productos de 0 de stock
*/
router.get("/user",(s,r)=>{
    /*aca se guardara el wehere del query*/
    let where = s.query.where;
    /*aca se guardara el limit de la query*/
    let limit = s.query.limit;
    /*guardara todos los productos enn los carritos*/
    let Products = [];
    if(where){//se pregunta si el solicitante quere un registro en especifico
        Products = cart.searchConditional(where);
        where += (Products.length > 0)?" && ":"" + Products.map((product)=>` id != ${product.id}`).join(" && ");
    }else{
        Products = cart.toArray();
        where = (Products.length > 0)?Products.map((product)=>` id != ${product.id}`).join(" && "):"1";
    }
    if(limit){//se pregunta si quiere un limite a la informacion
        if(limit - Products.lenght <= 0){
            r.send(Products);
            return;
        }
        limit = "LIMIT " + limit;
    }else{
        limit = "";
    }
    POOL.query("SELECT id, nombre, precio, cantidad, descripcion, imagenes FROM productos WHERE " + where + " " + limit).then((res)=>{
        r.send(res[0].concat(Products));
    }).catch((e)=>{
        console.log(e);
        r.send(e);
    });
});

/*
* Este endpoint sirve para crear nuevos usuarios
*/
router.post("/user",(s,r)=>{
    /*se envia un correo*/
    sendMail("luis", "luis.giraldo3@utp.edu.co", s.body.correo, "Nuevo usuario", "Nuevo usuario registrado").then(()=>{
        /*una expresion regular para saber si un string es un numero o no*/
        const regex = /^[0-9]*$/;
        /*se guardara los values del body*/
        let values = Object.values(s.body);
        /*se guardara las keys del body*/
        let keys = Object.keys(s.body);
        POOL.query(`INSERT INTO usuarios (${keys.join(",")}) VALUES (${values.map((value)=>(regex.test(value)?value:`"${value}"`)).join(",")})`).then((res)=>{
            r.send(res);
        }).catch((e)=>{
            r.send(e);
        });
    }).catch((e)=>{
        console.log(e)
        r.sendStatus(206);
    });
});

/*
* este endpoint se utiliza para la compra final para disminuir definitivamente el stock
*/
router.put("/user",(s,r)=>{
    if(!s.body.id || !s.body.cantidad){
        r.sendStatus(404);
        return;
    }
    POOL.query(`SELECT nombre, minimo, cantidad FROM productos where id = ${s.body.id}`).then((res)=>{
        /*Se guardara el minimo de stock del producto*/
        let minimun = res[0][0].minimo;
        /*Se guarda la cantidad actual del producto*/
        let amount = res[0][0].cantidad;
        /*se guarda el nombre del producto*/
        let name = res[0][0].nombre;
        /*se guarda el id unico del producto*/
        let id = s.body.id;
        if(minimun >= amount + s.body.cantidad){
            /*se envia un cooreo al admin diciendo quee se acaba el stock*/
            sendMail("luis", "luis.giraldo3@utp.edi.co", CONFIG.email, `se te esta acabando el stock del producto ${nombre}`, `El producto ${name} con el id ${id} se esta acabando el stock.\n Stock actual: ${amount}`)
        }
        if(amount + s.body.cantidad <= 0){
            r.send(amount + s.body.cantidad).sendStatus(409);
        }
        POOL.query(`UPDATE cantidad FROM productos WHERE id = ${id}`).then((res)=>{
            r.send(res);
        }).catch((e)=>{
            r.send(e).sendStatus(500);
        });

    }).catch((e)=>{
        r.send(e).sendStatus(500);
    });
});

/*
* Este se utiliza para reservar productos al usuario
*/
router.patch("/user",(s,r)=>{
    if(!s.body.id || !s.body.cantidad){
        r.sendStatus(404);
        return;
    }
    /*Aca se guardara el producto que busca el usuario*/
    let product = cart.searchId(s.body.id, 0, cart.length);
    if(product != null){
        let amount = product.amount;
        if(!(amount + s.body.cantidad < 0)){
            product.amount = amount + s.body.cantidad;
        }else{
            product.amount = 0;
        }
        /*Guardara el total que queda en stock, si es negativo simplemente guardara los que pueda*/
        let all = amount + s.body.cantidad;
        r.send(all.toString());
    }else{
        POOL.query(`SELECT id, nombre, precio, cantidad, descripcion, imagenes FROM productos where id = ${s.body.id}`).then((res)=>{
            product = ShoppingCart.product(res[0][0].id, res[0][0].nombre, res[0][0].precio, res[0][0].cantidad, res[0][0].descripcion, res[0][0].imagenes);
            cart.append(product);
            let amount = product.amount;
            if(!(amount + s.body.cantidad < 0)){
                product.amount = amount + s.body.cantidad;
            }else{
                product.amount = 0;
            }
            /*Guardara el total que queda en stock, si es negativo simplemente guardara los que pueda*/
            let all = amount + s.body.cantidad;
            r.send(all.toString());
        });
    }
});

module.exports = router;