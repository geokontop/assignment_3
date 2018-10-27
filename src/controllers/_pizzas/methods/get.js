/*
 * Pizzas get  method
 * 
 */

 // Dependencies
 const _data = require('../../../models/data')
 const validator = require('../../../services/validators')

 // Get 
 // Required data : none
 // Optional data : id
const get = function(data,callback){
    // Check that id is valid
    const id = validator.validateString(data.queryStringObject.id) ? data.queryStringObject.id.trim():false;
    
    if(id){
        _data.read('pizzas',id,function(err,pizzaData){
            if(!err && pizzaData){
                callback(200,pizzaData);
            }else{
                callback(404);
            }
        })
    }else{       
        callback(400,{'Error':'Missing required fields'})
    }
}

// Export get function
module.exports = get;
