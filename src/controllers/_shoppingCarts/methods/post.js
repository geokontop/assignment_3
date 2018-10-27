
/*
 * Shopping cart post - add item to cart
 * 
 */

// Dependencies
const _data = require('../../../models/data')
const _tokenData = require('../../../models/token/tokenData')
const validator = require('../../../services/validators');

// Post
// Required data : id, quantity
// Optional data : none
const post = function(data,callback){
    // Check that all required fields are filled out
    const pizzaId = validator.validateString(data.payload.id) ? data.payload.id.trim():false;
    const quantity = typeof(data.payload.quantity) == 'number' && data.payload.quantity > 0 
                    && data.payload.quantity % 1 == 0 ? data.payload.quantity:false;

    if(pizzaId && quantity){
        
        // Get the token from the headers
        const token = validator.validateToken(data.headers.token) ? data.headers.token:false;
        // Retrieve token object        
        _data.read('tokens',token,function(err,tokenData){
            // Check authentication
            if(!err && tokenData){
                // Check if the token has not expired
                if(tokenData.expires > Date.now()){ 
                    // Create new item object
                    const pizzaObject = {
                        'id':pizzaId,
                        'quantity':quantity
                    }
                    // Retrieve shopping cart
                    _data.read('shoppingCarts',token,function(err,cartData){
                        if(err){
                            // If cart does not exist, create it with the item added 
                            // Create new cart file and save
                            _data.create('shoppingCarts',token,[pizzaObject],function(err){
                                if(!err){
                                    callback(200)
                                }else{
                                    callback(500,{'Error':'Could not create the new shopping cart'})
                                }
                            })    
                        }else{
                            // If cart exists, look if the item is allready in the cart
                            const foundItemArr = cartData.filter(obj=>{return obj.id ==pizzaId});
                            if(foundItemArr.length>0){
                                // Item allready exists, change quantity
                                foundItem = foundItemArr[0]
                                const indx = cartData.indexOf(foundItem);
                                cartData.splice(indx,1);
                                foundItem.quantity = foundItem.quantity + quantity;                   
                                cartData.push(foundItem);
                            }else{
                                // Item does not exist, put it into the cart
                                cartData.push(pizzaObject);
                            }
                            // Update the file
                            _data.update('shoppingCarts',token,cartData,function(err){
                                if(!err){
                                    callback(200);
                                }else{
                                    callback(500,{'Error':'Could not add to cart'})
                                }
                            });
                        }
                        //  Extend the token\'s expiration time by 60 min
                        _tokenData.extendExpirationTime(token,60);
                    });
                }else{
                    // Token too old
                    callback(400,{'Error':'Time expired. Token not valid'});
                }
            }else{
                // Not authenticated
                callback(400,{'Error':'Authentication error'});
            }
        });       
    }else{
        callback(400,{'Error':'Missing required fields'})
    }
}

// Export post function
module.exports= post ;