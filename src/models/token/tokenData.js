/*
 * Token data mechanisms
 * 
 */

// Dependencies
const _data = require('../data')

lib ={};

lib.extendExpirationTime = (token, minutes)=>{
    
    // Lookup token
    _data.read('tokens',token,(err,tokenData)=>{
        if(!err){
            tokenData.expires = Date.now() + 1000 * 60 * minutes;
            _data.update('tokens',token,tokenData,(err)=>{
                if(err){
                    console.log(err);
                }
            })
        }else{
            console.log(err);
        }        
    });
}


module.exports = lib;
