/*
 * Users post method
 * 
 */

// Dependencies
const _data = require('../../../models/data')
const helpers = require('../../../services/helpers')
const validator = require('../../../services/validators')

// Post
// Required data : name, email, address, password
// Optional data : none
const post = function(data,callback){
     // Check that all required fields are filled out
     const name = validator.validateString(data.payload.name) ? data.payload.name.trim():false;
     const email = validator.validateEmail(data.payload.email) ? data.payload.email.trim():false;
     const address = validator.validateString(data.payload.address) ? data.payload.address.trim():false;
     const password = validator.validatePassword(data.payload.password) ? data.payload.password.trim():false;

     if(name && email && address && password){
         // Make sure that the user doesn't exist
        _data.read('users',email,function(err,data){
            if(err){
                // Hash password
                hashedPassword = helpers.hash(password);

                if(hashedPassword){
                    // Create new user object
                    const userObject = {
                        'name':name,
                        'email':email,
                        'address': address,
                        'hashedPassword': hashedPassword
                    }
                    // Create new user file and save
                    _data.create('users',email,userObject,function(err){
                        if(!err){
                            callback(200)
                        }else{
                            console.log(err)
                            callback(500,{'Error':'Could not create the new user'})
                        }
                    })
                }else{
                    callback(500,{'Error':'Could not hash password'})
                }
        
            }else{
                // User allready exists
                callback(400,{'Error':'A user with that email allready exists'})
            }
        });
     }else{
         callback(400,{'Error':'Missing required fields'})
     }
}

// Export post function
module.exports= post ;