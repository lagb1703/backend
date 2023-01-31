
/*
* Esta clase servira para guardar los datos del usuario
*/
class user{
    /*guardara el nombre*/
    name = "";
    /*guardara el correo*/
    email = "";
    /*Guardara la direccion*/
    address = null;
    /*guarda el telefono*/
    cellPhone = 0;
    /*el tipo de usuario*/
    type = 0;/*0=usuario normal; 1=admin; el resto se le pueden dar otros usos*/
    constructor(name, email, address, cellPhone, type = 0){
        this.name = name;
        this.email = email;
        this.address = address;
        this.cellPhone = cellPhone;
        this.type = type;
    }
}

module.exports = user;