/*
 * Post order
 * 
 */

// Dependencies
const _data = require('../../../models/data');
const _userData = require('../../../models/user/userData');
const _shoppingCartData = require('../../../models/shoppingCart/shoppingCartData');
const stripe = require('../../../services/stripe');
const mailgun = require('../../../services/mailgun');
const validator = require('../../../services/validators');
const _orderData = require('../../../models/orders/orderData');
const helpers = require('../../../services/helpers')


// Post
// Required data : stripeToken
// Optional data : none
// Required header : token
const post = function(data,callback){
    // Get the token from the headers
    const token = validator.validateToken(data.headers.token) ? data.headers.token:false;
    // Get the stripeToken from the payload
    const stripeToken = validator.validateString(data.payload.stripeToken) ? data.payload.stripeToken:false;
    // Retrieve token object        
    _data.read('tokens',token,function(err,tokenData){
        // Check authentication
        if(!err && tokenData){
            // Check if the token has not expired
            if(tokenData.expires > Date.now()){ 
                // Retrieve user 
                _userData.getUserByEmail(tokenData.email,(user)=>{
                    if(user){
                        // Retrieve cart
                        _shoppingCartData.getCartDetailsByToken(token,(cartDetails)=>{
                            if(cartDetails){
                                stripe.checkOut(cartDetails.total,user.email,stripeToken,(status)=>{                                        
                                    if(!status){   
                                        console.log({'Message': 'Payment received .. sending message'});

                                        const htmlMessage = helpers.renderEmailMsg(cartDetails);
                                        //If the payment is successful. Send the mail
                                        mailgun.sendEmail(user.email, user.name, 'Your order details '+ user.name, htmlMessage,(res)=>{
                                            if(!res){
                                                _orderData.saveOrder(token,cartDetails,user,(saved)=>{
                                                    if(saved){
                                                        callback(200,{'Message': 'Payment received, message has been sent'})
                                                    }else{
                                                        callback(400, {'Error': 'Could not log order'})
                                                    }
                                                });
                                            }else{
                                                callback(400, {'Error': res});
                                            }
                                        });
                                    }
                                    else{
                                        callback(400, {'Error': 'There was some error receiving the payment,Please try again.'});
                                    }
                                });
                            }else{
                                callback(400, {'Error':'Cart record not found'});
                            }
                        });
                    }else{
                        callback(400, {'Error':'User record not found'})
                    }
                });
            }else{
                // Token too old
                callback(400,{'Error':'Time expired. Token not valid'});
            }
        }else{
            // Not authenticated
            callback(400,{'Error':'Authentication error'});
        }
    });  
}

// Export post function
module.exports= post ;