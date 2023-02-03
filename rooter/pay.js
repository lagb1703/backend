const router = require("express").Router();
const CONFIG = require("../utilities/config.json");
const stripe = require("stripe")(CONFIG.secretKey)


/*
* Aca se procesaran lso pagos
*/
router.post("/pay", (s,r)=>{
    let {id, amount, description} = s.body;
    stripe.paymentIntents.create({
        amount: amount*100,
        description: description,
        currency: 'cop',
        payment_method: id,
        confirm: true
    }).then((pay)=>{
        r.sendStatus(204);
    }).catch((e)=>{
        console.log(e);
        r.sendStatus(400);
    });
});

module.exports = router;