/*
 * Tokens routing -> http request  methods 
 * 
 */

// Dependencies
const _data = require('../../models/data')
const post = require('./methods/post')
const get = require('./methods/get')
const put = require('./methods/put')
const deleteMethod = require('./methods/delete')

// Container
const method = {}

// Methods' map
method.post = post
method.get = get
method.put = put
method.delete = deleteMethod

// Check if a token is valid for a given user
method.verifyUserByToken = function(id,email,callback){
    // Lookup token
    _data.read('tokens',id,function(err,tokenData){
        if(!err && tokenData){
            // Check that the token is for the given user and has not expired
            if(tokenData.email == email && tokenData.expires > Date.now()){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            callback(false)
        }
    })
    
}

module.exports = method;
