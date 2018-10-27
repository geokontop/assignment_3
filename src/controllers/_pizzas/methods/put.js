/*
 * Pizzas put method
 * 
 */

// Dependencies
const _data = require('../../../models/data')
const config = require('../../../config')
const validator = require('../../../services/validators');

// Put 
// Required data : id
// Optional data : name, ingredients, size, price (at least one of them)
const put = function(data,callback){
    // Check that id is valid
    const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length> 0
                ? data.payload.id.trim():false;
    // Check optional fields
    const name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length> 0? data.payload.name.trim():false;
    const ingredients = typeof(data.payload.ingredients) == 'object' && data.payload.ingredients instanceof Array && data.payload.ingredients.length > 0 ? data.payload.ingredients:false;
    const size = typeof(data.payload.size) == 'string' && ['small', 'medium', 'big'].indexOf(data.payload.size) > -1 ? data.payload.size:false;
    const price = typeof(data.payload.price) == 'number' && data.payload.price > 0 ? data.payload.price:false;

    
    // Error if id is invalid
    if(id){
        // Error if nothing is sent to update
        if(name || ingredients || size || price){
            
            // Get the token from the headers
            const token =  validator.validateToken(data.headers.token) ? data.headers.token:false; 
            // Retrieve the token
            _data.read('tokens',token,function(err,tokenData){
                if(!err && tokenData){
                    // Check if the token has not expired
                    if(tokenData.expires > Date.now()){
                        // Check if the user is athorized
                        if(tokenData.email == config.admin){
                            // Retrieve the pizza
                            _data.read('pizzas',id,function(err,pizzaData){
                                if(!err && pizzaData){
                                    if(name){
                                        pizzaData.name = name;
                                    }
                                    if(ingredients){
                                        pizzaData.ingredients = ingredients;
                                    }
                                    if(size){
                                        pizzaData.size = size;
                                    }
                                    if(price){
                                        pizzaData.price = price;
                                    }
                                    _data.update('pizzas',id,pizzaData,function(err){
                                        if(!err){
                                            callback(200);
                                        }else{
                                            callback(500,{'Error':'Could not update the pizza'})
                                        }
                                    })
                                }else{
                                    callback(400,{'Error':'Specified pizza does not exist'});
                                }
                            });
                        }else{
                            callback(401,{'Error':'Authorization error'});
                        }
                    }else{
                        callback(400,{'Error':'Time expired. User must loggin again'});
                    }
                }else{
                    callback(400,{'Error':'Authentication error'});
                }
            });
        }else{
            callback(400,{'Error':'Missing fields to update'});
        }
    }else{
        callback(400,{'Error':'Missing required field or field is invalid'});
    }
}

// Export function
module.exports = put;
