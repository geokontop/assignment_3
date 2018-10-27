/*
 * Users delete
 * 
 */

 // Dependencies
const _data = require('../../../models/data')
const _tokens = require('../../_tokens/methods')
const validator = require('../../../services/validators')

// @TODO delete amy other data files associated with the user
// Delete 
// Required data : email
// Optional data : none
const deleteMethod = function(data,callback){
    // See if email is valid
    const email = validator.validateEmail(data.payload.email) ? data.payload.email.trim():false;
    
    if(email){
        // Get the token from the headers
        const token = validator.validateToken(data.headers.token) ? data.headers.token:false;
        // Verify that the given token is valid for the email
        _tokens.verifyUserByToken(token,email,function(tokenIsValid){
            if(tokenIsValid){
                _data.read('users',email,function(err,data){
                if(!err && data){
                    _data.delete('users',email,function(err){
                        if(!err){
                            callback(200);
                        }else{
                            callback(500,{'Error': "Could not delete the specified user"})
                        }
                    })
                }else{
                callback(400,{'Error':'Could not find specified user'});
                }
                })
            }else{
                callback(403,{'Error':'Missing required token in header or token is invalid'})
            }
        });

    }else{
        callback(400, {'Error':'Missing required field'});
    }
}


// Export 
module.exports = deleteMethod;
