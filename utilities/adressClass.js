/*
* Esta clase guardara un formato de direccion
*/
class adress{
    /*guardara la avenida*/
    avenue = "";
    /*guardara la calle*/
    street = "";
    /*Guardara el numero*/
    number = "";
    /*guardara las otras descripciones de una direccion*/
    others = "";
    constructor(avenue, street, number, oters){
        this.avenue = avenue; 
        this.street = street;
        this.number = number;
        this.others = oters;   
    }

    /*
    * void => string
    * genera una direccion entendible con respecto a los parametros avenue, stret, number y others
    */
    toString(){
        return `${this.avenue} ${this.street} ${this.number} ${this.oters}`;
    }
}

module.exports = adress;