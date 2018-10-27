/*
 * Mailgun functionality
 * 
 */

// Dependencies
 const config = require('../config');
 var querystring = require('querystring');
 var https = require('https');

 // Container
const lib={};

// Charge a credit card with Stripe
lib.sendEmail = function(toEmail, toName, subject, message, callback) {
    // validate parameters
    var emailRegex = /\S+@\S+\.\S+/;
    toEmail = typeof(toEmail) === 'string' && emailRegex.test(toEmail) ? toEmail.trim() : false;
    toName = typeof(toName) === 'string' && toName.trim().length > 2 ? toName.trim() : false;
    subject = typeof(subject) === 'string' && subject.trim().length > 2 ? subject.trim() : false;
    message = typeof(message) === 'string' && message.trim().length > 2 ? message.trim() : false;
    

    if (toEmail && toName && message) {
        // Configure the request payload
        var payload = {
            'from' : 'Pizza Napolitana <'+ config.mailgun.from +'>',
            'to' : toEmail,
            'subject' : subject,
            'text' : 'Your mail does not support HTML',
            'html' : message
        };

        // Stringfy the payload
        var stringPayload = querystring.stringify(payload);
        
        // Configure the request details
        var requestDetails = {
            'protocol' : 'https:',
            'hostname' : 'api.mailgun.net',
            'method' : 'POST',
            'path' : '/v3/' + config.mailgun.domainName + '/messages',
            'auth' : 'api:' + config.mailgun.apiKey,
            'headers' : {
                'Content-type' : 'application/x-www-form-urlencoded',
                'Content-length' : Buffer.byteLength(stringPayload)
            }
        };

        // Instantiate the request object
        var req = https.request(requestDetails, res => {
            // Grab the status of the sent request
            var status = res.statusCode;
            // Callback successfuly if the request went through
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                console.log('Status code returned was '+ status);
                callback('Status code returned was '+ status);
            }
        });
        

        // Bind to the error event so it doesn't get thrown
        req.on('error', e => {
            callback(e);
        });

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();

    } else {
        callback('Given parameters are missing or invalid.');
    }
};


module.exports = lib;