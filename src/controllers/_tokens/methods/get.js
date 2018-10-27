/*
 * Tokens get  method
 * 
 */

 // Dependencies
 const _data = require('../../../models/data')
 const validator = require('../../../services/validators')

 // Get 
 // Required data : id
 // Optional data : none
const get = function(data,callback){
    // Chec that id is valid
    const id = validator.validateToken(data.queryStringObject.id) ? data.queryStringObject.id.trim():false;
    if(id){
        _data.read('tokens',id,function(err,tokenData){
            if(!err && tokenData){
                callback(200,tokenData);
            }else{
                callback(404);
            }
        })
    }else{
        callback(400, {'Error':'Missing required field'});
    }
}

// Export get function
module.exports = get;
