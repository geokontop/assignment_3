/*
 * Tokens post request method
 * 
 */

// Dependencies
const _data = require('../../../models/data')
const helpers = require('../../../services/helpers')
const validator = require('../../../services/validators')
const config = require('../../../config')

// Post
// Required data : email, password
// Optional data : none
const post = function(data,callback){
    // Check that all required fields are filled out
    const email = validator.validateEmail(data.payload.email) ? data.payload.email.trim():false;
    const password = validator.validatePassword(data.payload.password) ? data.payload.password.trim():false;
 
    if(email && password){
        // Retrieve the user
        _data.read('users',email,function(err,userData){
            if(!err && userData){
                // Hash the password and compare it with the password retrieved
                const hashedPassword = helpers.hash(password);

                if(hashedPassword == userData.hashedPassword){
                    // if valid create a new token with expiration date 1 hour from now
                    const tokenId = helpers.createRandomString(config.tokenLength);
                    const expires = Date.now()+ 1000 * 60* 60;
                    const tokenObject = {
                        'email' : email,
                        'id' : tokenId,
                        'expires' : expires
                    };

                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, function(err){
                        if(!err){
                            callback(200,tokenObject);
                        }else{
                            callback(500, {'Error':'Could not create the new token'});
                        }
                    });
                }else{
                    callback(400,{'Error':'Password did not match the retrieved one'})
                }
            }else{
                callback(400,{'Error':'Could not find specified user'})
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'})
    }
}

// Export post function
module.exports= post ;