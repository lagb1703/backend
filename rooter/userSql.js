const router = require("express").Router();
const pool = require("../utilities/sqlconection");
const config = require("../utilities/config.json");
const shoppingCart = require("../utilities/shoppingCart")
const sendMail = require("../utilities/mailer");

let cart = new shoppingCart();

router.get("/user",(s,r)=>{
    /*aca se guardara el wehere del query*/
    let where = s.query.where;
    /*aca se guardara el limit de la query*/
    let limit = s.query.limit;
    /*guardara todos los productos enn los carritos*/
    let products = [];
    if(where){
        products = cart.searchConditional(where);
        where += " && " + products.map((product)=>` id != ${product.id}`).join(" && ");
    }else{
        products = cart.toArray();
        where = products.map((product)=>` id != ${product.id}`).join(" && ");
    }
    if(limit){
        if(limit - products.lenght <= 0){
            r.send(products);
            return;
        }
        limit = "LIMIT " + limit;
    }else{
        limit = "";
    }
    pool.query("SELECT id, nombre, precio, cantidad, descripcion, imagenes FROM productos " + where + " " + limit).then((res)=>{
        r.send(res[0].concar(products));
    }).catch((e)=>{
        console.log(e);
        r.send(e);
    });
});

router.post("/user",(s,r)=>{
    sendMail("luis", "luis.giraldo3@utp.edu.co", s.body.correo, "Nuevo usuario", "Nuevo usuario registrado").then(()=>{
        /*una expresion regular para saber si un string es un numero o no*/
        const regex = /^[0-9]*$/;
        /*se guardara los values del body*/
        let values = Object.values(s.body);
        /*se guardara las keys del body*/
        let keys = Object.keys(s.body);
        pool.query(`INSERT INTO usuarios (${keys.join(",")}) VALUES (${values.map((value)=>(regex.test(value)?value:`"${value}"`)).join(",")})`).then((res)=>{
            r.send(res);
        }).catch((e)=>{
            r.send(e);
        });
    }).catch((e)=>{
        console.log(e)
        r.sendStatus(206);
    });
});

router.put("/user",(s,r)=>{
    if(!s.body.id || !s.body.cantidad){
        r.sendStatus(404);
        return;
    }
    pool.query(`SELECT nombre, minimo, cantidad FROM productos where id = ${s.body.id}`).then((res)=>{
        /*Se guardara el minimo de stock del producto*/
        let minimun = res[0][0].minimo;
        /*Se guarda la cantidad actual del producto*/
        let amount = res[0][0].cantidad;
        /*se guarda el nombre del producto*/
        let name = res[0][0].nombre;
        /*se guarda el id unico del producto*/
        let id = s.body.id;
        if(minimun >= amount + s.body.cantidad){
            sendMail("luis", "luis.giraldo3@utp.edi.co", config.email, `se te esta acabando el stock del producto ${nombre}`, `El producto ${name} con el id ${id} se esta acabando el stock.\n Stock actual: ${amount}`)
        }
        if(amount + s.body.cantidad <= 0){
            r.send(amount + s.body.cantidad).sendStatus(409);
        }
        pool.query(`UPDATE cantidad FROM productos WHERE id = ${id}`).then((res)=>{
            r.send(res);
        }).catch((e)=>{
            r.send(e).sendStatus(500);
        });

    }).catch((e)=>{
        r.send(e).sendStatus(500);
    });
});

router.patch("/user",(s,r)=>{
    if(!s.body.id || !s.body.cantidad){
        r.sendStatus(404);
        return;
    }
    /*Aca se guardara el producto que busca el usuario*/
    let product = cart.searchId(s.body.id);
    if(product != null){
        let amount = product.amount;
        if(!(amount + s.body.cantidad < 0)){
            product.amount = amount - s.body.cantidad;
        }
        r.send(amount + s.body.cantidad);
    }else{
        pool.query(`SELECT id, nombre, precio, cantidad, descripcion, imagenes FROM productos where id = ${s.body.id}`).then((res)=>{
            product = shoppingCart.product(res[0][0].id, res[0][0].nombre, res[0][0].precio, res[0][0].cantidad, res[0][0].descripcion, res[0][0].imagenes);
            cart.append(product);
            let amount = product.amount;
            if(!(amount + s.body.cantidad < 0)){
                product.amount = amount - s.body.cantidad;
            }
            r.send(amount + s.body.cantidad);
        });
    }
});

module.exports = router;