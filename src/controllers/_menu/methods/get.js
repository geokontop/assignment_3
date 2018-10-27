/*
 * Pizzas get  method
 * 
 */

 // Dependencies
 const _data = require('../../../models/data')

 // Get 
 // Required data : none
 // Optional data : none
 // Header data : none
const get = function(data,callback){
    
    // Return menu
    _data.createMenu('pizzas\\', function(err) {
            callback(500,{'Error': err})
            throw err;
        },function(menu){
            if(menu){
                callback(200,menu)
            }else{
                callback(500,{'Error':'Could not generate menu, maybe no menu items exist'})
            }
        }); 
}

// Export get function
module.exports = get;
