class products{
    anterior = null;
    siguiente = null;
    id = -1;
    name = "";
    price = 0;
    amount = 0;
    description = ""
    source = [];
    constructor(id, nombre = "", precio = 0,cantidad = 0, descripcion = "", imagen = null){
        this.id = id;
        this.name = nombre;
        this.amount = cantidad;
        this.price = precio;
        this.source = imagen;
        this.description = descripcion;
    }

    toJson(){
        return{id:this.id, nombre:this.name, precio:this.price, cantidad:this.amount, descripcion: this.description, imagenes: this.source};
    }
}

class shoppingCart{
    root = null;
    length = 0;

    static product(id, nombre = "", precio = 0, cantidad = 0, descripcion = "", imagenes = null){
        return new products(id, nombre, precio, cantidad, descripcion, imagenes);
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {Number} pos 
     * @returns {producto}
     * @description devuelve el producto en la posicion indicada, ojo no el id, sino la posicion en la lista
     */
    go(pos){
        if(pos > this.length){
            return null;
        }
        let auxiliar = this.root;
        for(let i = 0; i < pos; i++){
            auxiliar = auxiliar.siguiente;
        }
        return auxiliar;
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {String} condicion
     * @returns {Array}
     * @description esta funcion busca por medio simbolos como < > = entre todos los productos y devulve
     * en forma de array
     */
    searchConditional(condicion){
        let comand = condicion.split(" ");
        let auxiliar = this.root;
        const keys = {
            id:(condicion, id)=>{
                let products = [];
                while(auxiliar != null){
                    switch(condicion){
                        case "=":
                            if(id == auxiliar.id){
                                return [auxiliar.toJson()];
                            }
                            break;
                        case "<":
                            if(auxiliar.id < id){
                                products.push(auxiliar.toJson());
                            }
                            break;
                        case ">":
                            if(auxiliar.id > id){
                                products.push(auxiliar.toJson());
                            }
                            break;
                    }
                    auxiliar = auxiliar.siguiente;
                }
                return products;
            },
            nombre:(condicion, nombre)=>{
                let products = [];
                while(auxiliar != null){
                    if(auxiliar.name == nombre){
                        products.push(auxiliar.toJson());
                    }
                    auxiliar = auxiliar.siguiente;
                }
                return products;
            },
            precio:(condicion, precio)=>{
                let products = [];
                while(auxiliar != null){
                    switch(condicion){
                        case "=":
                            if(precio == auxiliar.price){
                                products.push(auxiliar.toJson());
                            }
                            break;
                        case "<":
                            if(auxiliar.price < precio){
                                products.push(auxiliar.toJson());
                            }
                            break;
                        case ">":
                            if(auxiliar.price > precio){
                                products.push(auxiliar.toJson());
                            }
                            break;
                    }
                    auxiliar = auxiliar.siguiente;
                }
                return products;
            },
            cantidad:(condicion, cantidad)=>{
                let products = [];
                while(auxiliar != null){
                    switch(condicion){
                        case "=":
                            if(cantidad == auxiliar.amount){
                                products.push(auxiliar.toJson());
                            }
                            break;
                        case "<":
                            if(auxiliar.amount < cantidad){
                                products.push(auxiliar.toJson());
                            }
                            break;
                        case ">":
                            if(auxiliar.amount > cantidad){
                                products.push(auxiliar.toJson());
                            }
                            break;
                    }
                    auxiliar = auxiliar.siguiente;
                }
                return products;
            }
        }
        return keys[comand[0]](comand[1], comand[2]);
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {Number} id 
     * @param {Number} inicio 
     * @param {Number} final 
     * @returns {producto}
     * @description esta funcion busca por medio de busqueda binaria el producto con el id indicado
     */
    searchId(id, inicio, final, n = 5){
        let medio = Math.floor((final + inicio)/2);
        let go = this.go(medio);
        if(go != undefined){
            if(go.id == id)
                return go;
        }else{
            return null;
        }
        if(inicio == final || medio < 0){
            return null;
        }
        if(go.id > id){
            return this.searchId(id, inicio, medio - 1, n - 1);
        }else{
            return this.searchId(id, medio + 1, final, n - 1);
        }
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {Funtion} funtion 
     * @returns {void}
     * @description ejecuta la funcion callback por cada producto activa que halla, a esta funcion se le 
     * pasa como parametros, el producto y la posicion de este
     */
    map(funtion, array=[]){
        let auxiliar = this.root;
        var i = 0;
        while(auxiliar != null){
            array.push(funtion(auxiliar, i));
            auxiliar = auxiliar.siguiente;
            i++;
        }
        return array;
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {baatalla} producto 
     * @returns {producto}
     * @description esta funcion agrega ordenadamente por el id, a la lista la producto que le demos, 
     * si algun id esta repetido, la nueva producto cambiara si id sumandole uno hasta encontrar uno 
     * vacio
     */
    append(producto){
        if(this.root == null){
            producto.siguiente = null;
            producto.anterior = null;
            this.root = producto;
            this.length += 1;
            return producto;
        }else{
            let auxiliar = this.root;
            while(auxiliar.siguiente != null && producto.id > auxiliar.id){
                auxiliar = auxiliar.siguiente;
            }
            if(auxiliar == this.root){
                this.root = producto;
                producto.siguiente = auxiliar;
                auxiliar.anterior = producto;
            }else if(auxiliar.siguiente == null){
                producto.anterior = auxiliar;
                auxiliar.siguiente = producto;
            }else{
                producto.anterior = auxiliar.anterior;
                producto.siguiente = auxiliar; 
                auxiliar.anterior = producto;
            }
            this.length += 1;
            return producto;
        }
    }

    /**
     * @public
     * @version 1.0
     * @author Dr.lagb1703
     * @param {String} condicion
     * @returns {Array}
     * @description combierte toda la lista en un array de JSON
     */
    toArray(){
        return this.map((product)=>product.toJson());
    }
}
module.exports = shoppingCart;