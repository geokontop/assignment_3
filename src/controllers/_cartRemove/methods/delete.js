/*
 * Pizzas delete
 * 
 */

 // Dependencies
 const _data = require('../../../models/data')
 const config = require('../../../config')
 const validator = require('../../../services/validators');
 
 // Delete cart record from the system
 // Required data : none
 // Optional data : none
 // Required header : token
 const deleteMethod = function(data,callback){
    // Get the token from the headers
    const token = validator.validateToken(data.headers.token) ? data.headers.token:false;
    if(token){
        // Retrieve cart object 
            _data.read('shoppingCarts',token,function(err,orderData){
                if(!err && orderData){
                    _data.delete('shoppingCarts',token,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            callback(500,{'Error': "Could not delete shopping cart"})
                        }
                    })
                }else{
                callback(400,{'Error':'Could not find specified cart'});
                }
            });
    }else{
        callback(400, {'Error':'Authentication error, missing header'});
    }
}


// Export 
module.exports = deleteMethod;
