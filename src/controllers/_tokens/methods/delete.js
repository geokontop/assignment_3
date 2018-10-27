/*
 * Tokens delete
 * 
 */

 // Dependencies
 const _data = require('../../../models/data')
 const validators = require('../../../services/validators')

 // Delete 
 // Required data : id
 // Optional data : none
 const deleteMethod = function(data,callback){
     // See if id is valid
     const id = validators.validateToken(data.queryStringObject.id)  ? data.queryStringObject.id.trim():false;
     
     if(id){
         _data.read('tokens',id,function(err,data){
         if(!err && data){
             _data.delete('tokens',id,function(err){
                 if(!err){
                     callback(200);
                 }else{
                     callback(500,{'Error': "Could not delete the specified token"})
                 }
             })
         }else{
         callback(400,{'Error':'Could not find specified token'});
         }
         })
     }else{
         callback(400, {'Error':'Missing required field'});
     }
 }
 
 
 // Export 
 module.exports = deleteMethod;
 