/*
 * Stripe functionality
 * 
 */

// Dependencies
 const validators = require('./validators');
 const config = require('../config');
 var querystring = require('querystring');
 var https = require('https');

// Create container
const lib = {};

// Check out to stripe
lib.checkOut = function(amount, email, stripeToken, callback){
    var amount = typeof(amount) == 'number' && amount > 0 ? amount : false;
    var email = validators.validateEmail(email) ? email : false;
    var stripeToken = validators.validateString(stripeToken) ? stripeToken : false;

    if(amount && email){
        
        // Configure the request payload
        var payload = {
            'amount' : Math.round(amount*100),
            'currency' : 'usd',
            'source' : stripeToken,
            'description' : 'Charge for ' + email
        };
        var stringPayload = querystring.stringify(payload);
        
        // Configure the request details
        const requestDetails = {
            protocol: 'https:',
            hostname: 'api.stripe.com',
            port: 443,
            method: 'POST',
            path: '/v1/charges',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(stringPayload),
              Authorization: `Bearer ${config.stripe.testAPIkey.Secret}`
            }
          };
        
         // Instantiate the request object
         var req = https.request(requestDetails,function(res){          
            // Grab the status of the sent request
            var status =  res.statusCode;
            // Callback successfully if the request went through          
            if(status == 200 || status == 201){
                callback(false);
            } else {
                callback('Status code returned was '+ status);
            }
        });

        // Bind to the error event so it doesn't get thrown
        req.on('error',function(e){
            console.log(e);
        });

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();

    }else{
        callback(400,{'Error':'Given parameters were invalid or missing'})
    }
}

module.exports = lib;