/*
 * Shopping cart get  method
 * 
 */

 // Dependencies
 const _data = require('../../../models/data')
 const _cartData = require('../../../models/shoppingCart/shoppingCartData')
 const _tokenData = require('../../../models/token/tokenData')
 const validator = require('../../../services/validators');

 // Get 
 // Required data : none
 // Optional data : none
const get = function(data,callback){

    // Get the token from the headers
    const token = validator.validateToken(data.headers.token) ? data.headers.token:false;
    // Retrieve token object        
    _data.read('tokens',token,function(err,tokenData){
        // Check authentication
        if(!err && tokenData){
            // Check if the token has not expired
            if(tokenData.expires > Date.now()){ 

                // Retrieve shopping cart detailed
                    _cartData.getCartDetailsByToken(token,(cartDetails)=>{
                        if(cartDetails){
                            callback(200,cartDetails);
                        }else{
                            callback(400,{'Error': 'Error retrieving cart. Maybe it is empty'})
                        }
                    })
                    
                    _tokenData.extendExpirationTime(token,60);

            }else{
                // Token too old
                callback(400,{'Error':'Time expired. Token not valid'});
            }
        }else{
            // Not authenticated
            callback(400,{'Error':'Authentication error'});
        }
    });
}

// Export get function
module.exports = get;
