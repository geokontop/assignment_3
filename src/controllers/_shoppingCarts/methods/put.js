/*
 * Shopping cart put method
 * 
 */

// Dependencies
const _data = require('../../../models/data')
const validator = require('../../../services/validators');


// Put
// Required data : id, quantity
// Optional data : none
const put = function(data,callback){
    // Check id and extend validity
    const pizzaId = validator.validateString(data.payload.id) ? data.payload.id.trim():false;
    const quantity = typeof(data.payload.quantity) == 'number' && data.payload.quantity > 0 
                    && data.payload.quantity % 1 == 0 ? data.payload.quantity:false;
                    
    // Error if pizzaId or quantity is invalid
    if(pizzaId && quantity){
        // Get the token from the headers
        const token = validator.validateToken(data.headers.token) ? data.headers.token:false;
        // Retrieve the token
        _data.read('tokens',token,function(err,tokenData){
            if(!err && tokenData){
                // Check if the token has not expired
                if(tokenData.expires > Date.now()){
                    // Retrieve the cart
                    _data.read('shoppingCarts',token,function(err,cartData){
                        if(!err && cartData && cartData.length > 0){
                            // Check if the item exists in the cart
                            const foundItemArr = cartData.filter(obj=>{return obj.id == pizzaId});
                            if(foundItemArr.length>0){
                                // Item allready exists
                                foundItem = foundItemArr[0]
                                const indx = cartData.indexOf(foundItem);
                                cartData.splice(indx,1);
                                foundItem.quantity = quantity;                   
                                cartData.push(foundItem);
                                _data.update('shoppingCarts',token,cartData,function(err){
                                    if(!err){
                                        callback(200, cartData);
                                    }else{
                                        callback(500,{'Error':'Could not add to cart'})
                                    }
                                });
                            }else{
                                callback(404, {'Error':'Item not found'});
                            }

                        }else{
                            callback(404, {'Error':'Cart not found'});
                        }
                    });
                }else{
                    callback(400,{'Error':'The token has allready expired and cannot be extended'});
                }                   
            }else{
                callback(400,{'Error':'Specified token does not exist'});
            }
        });    
    }else{
        callback(400,{'Error':'Missing required field(s) or field(s) are invalid'});
    }
}

// Export function
module.exports = put;
