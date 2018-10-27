/*
 * Shopping cart data mechanisms
 * 
 */

// Dependencies
const _data = require('../data')

// Container
const lib = {};

// Store order
lib.saveOrder = (cartId, cartDetails, customer, callback)=>{

    // Make file name
    const filename = cartId + '_' + String(Date.now());

    // Make data
    const data = {'customer': customer, 'items':cartDetails}
    // Create new user file and save
    _data.create('orders',filename,data,function(err){
        if(!err){
            callback(true)
        }else{
            console.log(err)
            callback(false)
        }
    })
}

module.exports = lib;
