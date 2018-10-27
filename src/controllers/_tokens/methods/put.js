/*
 * Tokens put method
 * 
 */

// Dependencies
const _data = require('../../../models/data')
const validator = require('../../../services/validators')


// Put
// Required data : id, extend
// Optional data : none
const put = function(data,callback){
    // Check id and extend validity
    const id = validator.validateToken(data.payload.id) ? data.payload.id.trim():false;
    const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true  ? true:false;

    // Error if email is invalid
    if(id && extend){
            // Retrieve the token
            _data.read('tokens',id,function(err,tokenData){
                if(!err && tokenData){
                    // Check if the token has not expired
                    if(tokenData.expires > Date.now()){
                        // Set the expiration an hour from now
                        tokenData.expires = Date.now() + 1000 * 60 * 60;
                        _data.update('tokens',id,tokenData,function(err){
                            if(!err){
                                callback(200);
                            }else{
                                console.log(err);
                                callback(500,{'Error':'Could not update the token'})
                            }
                        })
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
