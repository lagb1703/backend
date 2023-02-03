const router = require("express").Router();
const CONFIG = require("../utilities/config.json");
const stripe = require("stripe")(CONFIG.secretKey)


/*
* Aca se procesaran lso pagos
*/
router.post("/pay", (s,r)=>{
    let customer = stripe.customers.create({
        email:s.body.strupeEmail,
        source: s.body.stripeToken
    });
    stripe.charges.create({
        amount: s.body.cantidad,
        currency: "cop",
        customer:customer.id,
        description:s.body.descripcion
    });
});

module.exports = router;