/*
 * Helpers for various tasks
 * 
 */

 // Dependencies
 const crypto = require('crypto');
 const config = require('../config')
 const path = require('path')
 const fs = require('fs')

 // Container
 const helpers = {};

// Create a SHA256 hash
helpers.hash = function(str){
    if(typeof(str)== 'string' && str.length>0){
        const hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
};

// Parse a JSON string to an obhect in all cases, without throwing
helpers.parseJsonToObject =function(str){
    try{
        const obj = JSON.parse(str)
        return obj;
    }catch(e){
        return {};
    }
}

// Create a string of random characters
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
        // Define all the possible characters that could go intoa string
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Construct random string
        let str = '';
        for(i = 1; i <= strLength; i++){
            let randomChar = possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length));
            str += randomChar;
        }
        return str;
    }else{
        return false;
    }
}

helpers.getTemplate = (templateName, data, callback)=>{
    templateName = typeof(templateName) == 'string' && templateName.length > 0? templateName : false;
    data = typeof(data) == 'object' && data !== null ? data : {};

    if(templateName){
        const templatesDir = path.join(__dirname ,'/../templates/');
        fs.readFile(templatesDir + templateName + '.html','utf8',(err,str)=>{
            if(!err && str && str.length> 0){
                const finalString = helpers.interpolate(str,data);
                callback(false,finalString);
            }else{
                callback('No template could be found');
            }
        });
    }else{
        callback('A valid template name was not specified')
    }
}

// Add the universal header and footer to a string , and pass provided data object to header and footer for interpolation
helpers.addUniversalTemplates = (str, data, callback)=>{
    
    str = typeof(str) == 'string' && str.length>0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};

    // Get the header
    helpers.getTemplate('_header',data,(err,headerString)=>{
        if(!err && headerString){
            // Get the footer
            helpers.getTemplate('_footer',data,(err,footerString)=>{
                if(!err && footerString){
                    // Add them all together
                    const fullString = headerString + str + footerString;
                    callback(false, fullString)
                }else{
                    callback('Could not find the footer template')
                }
            })
        }else{
            callback('Could not find the header template')
        }
    })
}

// Take a given string and a data obhect and find/replace all the keys within it
helpers.interpolate = (str,data)=>{
    
    str = typeof(str) == 'string' && str.length>0 ? str :'';
    data = typeof(data) == 'object' && data !== null ? data : {};
    // Add the templateGlobals to the data object, precenting their key name with "global"
    for(let keyName in config.templateGlobals){
        if(config.templateGlobals.hasOwnProperty(keyName)){
            data['global.'+keyName] = config.templateGlobals[keyName];
        }
    }

    // For each key in the data object, insert its value into the string at the corresponding placeholder
    for(let key in data){
        if(data.hasOwnProperty(key) && typeof(data[key])== 'string'){
            const replace = data[key];
            const find = '{' + key + '}';
            str = str.replace(find,replace);
        }
    }
    return str
}

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName, callback)=>{
    fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
    if(fileName){
        const publicDir = path.join(__dirname, '/../public/');
        fs.readFile(publicDir+ fileName, (err,data)=>{
            if(!err && data){
                callback(false, data);
            }else{
                callback('No file could be found')
            }
        })
    }else{
        callback('A valid filename was not specified');
    }
}

// Forms a message in html to be sent via mailgun. A table populated with cart details and the total cost. 
helpers.renderEmailMsg = (cartDetails)=>{
    let tableHtml = '<h1> Your order </h1>';
    tableHtml += '<table><tr><th>Pizza Name</th><th>Size</th><th>Price</th>' +
                '<th>Quantity</th><th>subtotal</th></tr>'
    cartDetails.cart.forEach(element=>{
        tableHtml += '<tr><td>' + element.name+'</td><td>'+ element.size+'</td><td>'+ element.price+'</td><td>'+
            element.quantity+'</td><td>'+ element.subtotal+'</td><tr>'
    })
    tableHtml += '<h1> Total $'+cartDetails.total+' </h1>';
    return tableHtml
}

module.exports = helpers;