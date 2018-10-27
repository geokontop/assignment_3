/*
 * Pizzas delete
 * 
 */

 // Dependencies
 const _data = require('../../../models/data')
 const config = require('../../../config')
 const validator = require('../../../services/validators');
 
 // Delete 
 // Required data : id
 // Optional data : none
 const deleteMethod = function(data,callback){
     // See if pizza id is valid
    const id = validator.validateString(data.queryStringObject.id) ? data.queryStringObject.id.trim():false;

    if(id){
        // Get the token from the headers
        const token =  validator.validateToken(data.headers.token) ? data.headers.token:false;
        // Retrieve token object        
        _data.read('tokens',token,function(err,tokenData){
            if(!err && tokenData){
                // Check if the token has not expired
                if(tokenData.expires > Date.now()){
                    if(tokenData.email == config.admin){
                        // Retrieve the pizza
                        _data.read('pizzas',id,function(err,pizzaData){
                            if(!err && pizzaData){
                                _data.delete('pizzas',id,function(err){
                                    if(!err){
                                        callback(200);
                                    }else{
                                        callback(500,{'Error': "Could not delete the specified pizza"})
                                    }
                                })
                            }else{
                            callback(400,{'Error':'Could not find specified pizza'});
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
        callback(400, {'Error':'Missing required field'});
    }
}


// Export 
module.exports = deleteMethod;
