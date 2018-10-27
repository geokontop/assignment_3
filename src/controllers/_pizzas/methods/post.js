/*
 * Pizzas post method
 * 
 */

// Dependencies
const _data = require('../../../models/data')
const config = require('../../../config')
const validator = require('../../../services/validators');

// Post
// Required data : id, name, ingredients, size, price
// Optional data : none
const post = function(data,callback){
    // Check that all required fields are filled out
    const pizzaId = validator.validateString(data.payload.id) ? data.payload.id.trim():false;
    const pizzaName = validator.validateString(data.payload.name) ? data.payload.name.trim():false;
    const ingredients = typeof(data.payload.ingredients) == 'object' && data.payload.ingredients instanceof Array && data.payload.ingredients.length > 0 ? data.payload.ingredients:false;
    const size = typeof(data.payload.size) == 'string' && ['small', 'medium', 'big'].indexOf(data.payload.size) > -1 ? data.payload.size:false;
    const price = typeof(data.payload.price) == 'number' && data.payload.price > 0 ? data.payload.price:false;

    if(pizzaId && pizzaName && ingredients && size && price){
        
        // Get the token from the headers
        const token = validator.validateToken(data.headers.token) ? data.headers.token:false;
        // Retrieve token object        
        _data.read('tokens',token,function(err,tokenData){
            // Check authentication
            if(!err && tokenData){
                // Check if the token has not expired
                if(tokenData.expires > Date.now()){
                    // Check if the user is athorized
                    if(tokenData.email == config.admin){
                        // Make sure that the pizza doesnt exist
                        _data.read('pizzas',pizzaId,function(err,data){
                            if(err){ 
                                    
                                // Create new user object
                                const pizzaObject = {
                                    'id':pizzaId,
                                    'name':pizzaName,
                                    'ingredients': ingredients,
                                    'size': size,
                                    'price': price
                                }
                                // Create new user file and save
                                _data.create('pizzas',pizzaId,pizzaObject,function(err){
                                    if(!err){
                                        callback(200)
                                    }else{
                                        callback(500,{'Error':'Could not create the new pizza'})
                                    }
                                })                         
                            
                            }else{
                                // Pizza allready exists
                                callback(400,{'Error':'A pizza with that id allready exists'})
                            }
                        })
                    }else{
                        // Not admin
                        callback(401,{'Error':'Authorization error'});
                    }
                }else{
                    // Token too old
                    callback(400,{'Error':'Time expired. User must loggin again'});
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