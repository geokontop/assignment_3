/*
 * User data mechanisms
 * 
 */

// Dependencies
const _data = require('../data')

lib ={};


lib.getUserByEmail= function(email,callback){
    // Retrieve the user
    _data.read('users',email,function(err,userData){
        if(!err && userData){
            delete userData.hashedPassword;
            // User exists
            callback(userData);
        }else{
            // File not found
            callback(false);
        }
    })
}

module.exports = lib;
