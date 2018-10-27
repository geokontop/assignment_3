/*
 * Shopping cart data mechanisms
 * 
 */

// Dependencies
const _data = require('../data')

// Container
lib ={};

// Retrieve cart from the token
lib.getCartByToken= function(token,callback){
    // Retrieve the cart
    _data.read('shoppingCarts',token,function(err,cartData){
        if(!err && cartData && cartData.length > 0){
            // Shopping cart exists
            callback(cartData);
        }else{
            // File not found
            callback(false);
        }
    })
}

// Retrive cart details from the token
lib.getCartDetailsByToken= function(token,callback){
    // Retrieve the cart
    _data.read('shoppingCarts',token,function(err,cartData){
        if(!err && cartData && cartData.length > 0){
            // Shopping cart exists
            let cartDetails = [];
            let total = 0;
            cartData.forEach(element => {
                _data.read('pizzas',element.id,function(err,pizzaData){
                    if(!err && pizzaData){
                        const itemDetails = {
                            "id": pizzaData.id,
                            "name": pizzaData.name,
                            "ingredients": pizzaData.ingredients,
                            "size": pizzaData.size,
                            "price": pizzaData.price,
                            "quantity": element.quantity,
                            "subtotal": element.quantity * pizzaData.price
                        }
                        
                        cartDetails.push(itemDetails);
                        
                        total += element.quantity * pizzaData.price;
                        
                        if(cartDetails.length >= cartData.length){
                            callback({"cart":cartDetails, "total":total});
                        }
                    }else{
                        callback(false)
                    }
                });
            });

        }else{
            // File not found
            callback(false);
        }
    })
}


module.exports = lib;
