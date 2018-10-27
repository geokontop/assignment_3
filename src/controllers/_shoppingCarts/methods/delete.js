/*
 * Delete shopping cart
 * 
 */

 // Dependencies
 const _data = require('../../../models/data')
 const validator = require('../../../services/validators');

 // Delete 
 // Required data : id
 // Optional data : none
 // Required header : token
 const deleteMethod = function(data,callback){
     // See if pizza id is valid
    const id = validator.validateString(data.queryStringObject.id) ? data.queryStringObject.id.trim():false;

    if(id){
        // Get the token from the headers
        const token = validator.validateToken(data.headers.token) ? data.headers.token:false;
        // Retrieve token object        
        _data.read('tokens',token,function(err,tokenData){
            if(!err && tokenData){
                // Check if the token has not expired
                if(tokenData.expires > Date.now()){
                    // Retrieve the cart
                    _data.read('shoppingCarts',token,function(err,cartData){
                        if(!err && cartData){
                            // Check if the item exists in the cart
                            const foundItemArr = cartData.filter(obj=>{return obj.id == id});
                            if(foundItemArr.length>0){
                                // Item exists in cart
                                foundItem = foundItemArr[0]
                                const indx = cartData.indexOf(foundItem);
                                cartData.splice(indx,1);
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
                        callback(400,{'Error':'Could not find specified cart'});
                        }
                    });
                }else{
                    callback(400,{'Error':'Time expired. Token is not valid'});
                }
            }else{
                callback(400,{'Error':'Authentication error'});
            }
        });
    }else{
        callback(400, {'Error':'Missing required field'});
    }
}


// Export 
module.exports = deleteMethod;
