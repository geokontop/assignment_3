/*
 * Users put method
 * 
 */

// Dependencies
const _data = require('../../../models/data')
const helpers = require('../../../services/helpers')
const _tokens = require('../../_tokens/methods')
const validator = require('../../../services/validators')

// Put
// Required data : email
// Optional data : name, address, password (at least one of them)
const put = function(data,callback){
    // Check email validity
    const email = validator.validateEmail(data.payload.email) ? data.payload.email.trim():false;

    // Check for the optional fields
    const name = validator.validateString(data.payload.name) ? data.payload.name.trim():false;
    const address = validator.validateString(data.payload.address) ? data.payload.address.trim():false;
    const password = validator.validatePassword(data.payload.password) ? data.payload.password.trim():false;
 
    // Error if email is invalid
    if(email){
        // Error if nothing is sent to update
        if(name || address || password){

            // Get the token from the headers
            const token = validator.validateToken(data.headers.token) ? data.headers.token:false;            
                
            // Verify that the given token is valid for the email
            _tokens.verifyUserByToken(token,email,function(tokenIsValid){
                if(tokenIsValid){                    
                    // Retrieve the user
                    _data.read('users',email,function(err,userData){
                        if(!err && userData){
                            if(name){
                                userData.name = name;
                            }
                            if(address){
                                userData.address = address;
                            }
                            if(password){
                                userData.hashedPassword = helpers.hash(password);
                            }
                            _data.update('users',email,userData,function(err){
                                if(!err){
                                    callback(200);
                                }else{
                                    console.log(err);
                                    callback(500,{'Error':'Could not update the user'})
                                }
                            })
                        }else{
                            callback(400,{'Error':'The specified user does not exist'});
                        }
                    });
                }else{
                    callback(403,{'Error':'Missing required token in header or token is invalid'})
                }
            });
        }else{
            callback(400,{'Error':'Missing fields to update'});
        }
    }else{
        callback(400,{'Error':'Missing required field'});
    }
}

// Export function
module.exports = put;
