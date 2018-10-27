/*
 * Users get method
 * 
 */

 // Dependencies
const _data = require('../../../models/data')
const _tokens = require('../../_tokens/methods')
const validator = require('../../../services/validators')

 // Get 
 // Required data : email
 // Optional data : none
const get = function(data,callback){
    // See if email is valid
    const email = validator.validateEmail(data.queryStringObject.email) ? data.queryStringObject.email.trim():false;
    
    if(email){
        // Get the token from the headers
        const token = validator.validateToken(data.headers.token) ? data.headers.token:false;
        // Verify that the given token is valid for the email
        _tokens.verifyUserByToken(token,email,function(tokenIsValid){
            if(tokenIsValid){
                _data.read('users',email,function(err,data){
                    if(!err && data){
                        // Remove hashed password from the retrieved object
                        delete data.hashedPassword;
                        callback(200,data);
                    }else{
                        callback(404,{'Error':'Inner loop'});
                    }
                });
            }else{
                callback(403,{'Error':'Missing required token in header or token is invalid'})
            }
        });
       
    }else{
        callback(400, {'Error':'Missing required field'});
    }
}

// Export get function
module.exports = get;
