/*
 * Handlers overview
 * 
 */


// Dependencies
const usersMethods = require('./_users/methods')
const tokensMethods = require('./_tokens/methods')
const pizzasMethods = require('./_pizzas/methods')
const menuMethods = require('./_menu/methods')
const cartsMethods = require('./_shoppingCarts/methods')
const cartRemoveMethods = require('./_cartRemove/methods')
const orderMethods = require('./_order/methods')
const helpers = require('../services/helpers')

// Define the handlers
const handlers = {};

/* 
 * HTML handlers
 * 
 */

// Index handler
handlers.index = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Pizza Napolitana on-line',
            'head.description' : 'Order pizza on-line',
            'body.class' : 'index'
        }
        // Read in a template as a string
        helpers.getTemplate('index',templateData,(err,str)=>{
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        // Return that page as Html
                        callback(200, str, 'html');
                    }else{
                        callback(501,undefined, 'html')
                    }
                });                
            }else{
                callback(502,undefined, 'html')
            }
        })
    }
}

// HTML Create account
handlers.accountCreate = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Create an account',
            'head.description' : 'Signup is easy and it only takes a few seconds',
            'body.class' : 'accountCreate'
        }
        // Read in a template as a string
        helpers.getTemplate('accountCreate',templateData,(err,str)=>{
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        // Return that page as Html
                        callback(200, str, 'html');
                    }else{
                        callback(501,undefined, 'html')
                    }
                });                
            }else{
                callback(502,undefined, 'html')
            }
        })
    }
}

// HTML Create new session
handlers.sessionCreate = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Create a new session',
            'head.description' : 'Provide email and password in order to create a new session.',
            'body.class' : 'sessionCreate'
        }
        // Read in a template as a string
        helpers.getTemplate('sessionCreate',templateData,(err,str)=>{
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        // Return that page as Html
                        callback(200, str, 'html');
                    }else{
                        callback(501,undefined, 'html')
                    }
                });                
            }else{
                callback(502,undefined, 'html')
            }
        })
    }
}

// HTML session has ben deleted
handlers.sessionDeleted = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Logged out',
            'head.description' : 'You successfully logged out of your accound.',
            'body.class' : 'sessionDeleted'
        }
        // Read in a template as a string
        helpers.getTemplate('sessionDeleted',templateData,(err,str)=>{
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        // Return that page as Html
                        callback(200, str, 'html');
                    }else{
                        callback(501,undefined, 'html')
                    }
                });                
            }else{
                callback(502,undefined, 'html')
            }
        })
    }
}

// HTML Account settings
handlers.accountEdit = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Account settings',
            'body.class' : 'accountEdit'
        }
        // Read in a template as a string
        helpers.getTemplate('accountEdit',templateData,(err,str)=>{
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        // Return that page as Html
                        callback(200, str, 'html');
                    }else{
                        callback(501,undefined, 'html')
                    }
                });                
            }else{
                callback(502,undefined, 'html')
            }
        })
    }
}

// HTML Account has been deleted
handlers.accountDeleted = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Account deleted',
            'head.description' : 'your account has been deleted',
            'body.class' : 'accountDeleted'
        }
        // Read in a template as a string
        helpers.getTemplate('accountDeleted',templateData,(err,str)=>{
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        // Return that page as Html
                        callback(200, str, 'html');
                    }else{
                        callback(501,undefined, 'html')
                    }
                });                
            }else{
                callback(502,undefined, 'html')
            }
        })
    }
}

// HTML menu
handlers.menuHtml = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Pizzas menu',
            'head.description' : 'The pizzas\'s menu ',
            'body.class' : 'menu'
        }
        // Read in a template as a string
        helpers.getTemplate('menu',templateData,(err,str)=>{
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        // Return that page as Html
                        callback(200, str, 'html');
                    }else{
                        callback(501,undefined, 'html')
                    }
                });                
            }else{
                callback(502,undefined, 'html')
            }
        })
    }
}

// HTML cart
handlers.showCart = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Cart contents',
            'head.description' : 'Show items added in yor cart and their cost subtotal and total',
            'body.class' : 'show-cart'
        }
        // Read in a template as a string
        helpers.getTemplate('showCart',templateData,(err,str)=>{
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        // Return that page as Html
                        callback(200, str, 'html');
                    }else{
                        callback(501,undefined, 'html')
                    }
                });                
            }else{
                callback(502,undefined, 'html')
            }
        })
    }
}

// HTML order total before submiting payment to stripe
handlers.showOrder = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Order to submit',
            'head.description' : 'Show the order details before submiting to stripe',
            'body.class' : 'show-order'
        }
        // Read in a template as a string
        helpers.getTemplate('showOrder',templateData,(err,str)=>{
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        // Return that page as Html
                        callback(200, str, 'html');
                    }else{
                        callback(501,undefined, 'html')
                    }
                });                
            }else{
                callback(502,undefined, 'html')
            }
        })
    }
}

// HTML shows the result of the transaction. An order review and a thank you or a failure message
handlers.showTransactionResult = (data, callback)=>{
    // Reject any request that isn't GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Order proccesed',
            'head.description' : 'The transaction was carried out. Order review and a message.',
            'body.class' : 'transaction-result'
        }
        // Read in a template as a string
        helpers.getTemplate('thankYou',templateData,(err,str)=>{
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        // Return that page as Html
                        callback(200, str, 'html');
                    }else{
                        callback(501,undefined, 'html')
                    }
                });                
            }else{
                callback(502,undefined, 'html')
            }
        })
    }
}

// Favicon
handlers.favicon = (data,callback)=>{
    // Reject any request that isn't a GET
    if(data.method){
        // Read the favicon's data
        helpers.getStaticAsset('favicon.ico',(err,data)=>{
            if(!err && data){
                callback(200, data,'favicon');
            }else{
                callback(500);
            }
        })
    }else{
        callback(405);
    }
}

// Public assets
handlers.public = (data,callback)=>{
    // Reject any request that isn't a GET
    if(data.method){
        // Get the filename been requested
        const trimmedAssetName = data.trimmedPath.replace('public/','').trim();
        if(trimmedAssetName.length > 0){
            // Read the asset's data
            helpers.getStaticAsset(trimmedAssetName,(err,data)=>{
                if(!err && data){
                    // Determine the content type (default to plain text)
                    let contentType = 'plain';

                    if(trimmedAssetName.indexOf('.css') > -1){
                        contentType = 'css';
                    }

                    if(trimmedAssetName.indexOf('.png') > -1){
                        contentType = 'png';
                    }

                    if(trimmedAssetName.indexOf('.jpg') > -1){
                        contentType = 'jpg';
                    }

                    if(trimmedAssetName.indexOf('.ico') > -1){
                        contentType = 'favicon';
                    }

                    // Callback the data
                    callback(200, data, contentType)
                }
            })
        }
    }else{
        callback(405);
    }
}

/* 
 * JSON API handlers
 * 
 */
/*--------- Users -----------*/
// Users handler
handlers.users =function(data, callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._users[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Users submethods
handlers._users = usersMethods;

/*--------- Tokens -----------*/
// Tokens handler
handlers.tokens =function(data, callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._tokens[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Tokens submethods
handlers._tokens = tokensMethods;

/*--------- Pizzas -----------*/
// Pizzas handler
handlers.pizzas =function(data, callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._pizzas[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Pizzas submethods
handlers._pizzas = pizzasMethods;

/*--------- Menu -----------*/
// Menu handler
handlers.menu =function(data, callback){
    const acceptableMethods = ['get'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._menu[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Menu submethods
handlers._menu = menuMethods;

/*--------- Carts -----------*/
// Carts handler
handlers.carts =function(data, callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._shoppingCarts[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Carts submethods
handlers._shoppingCarts = cartsMethods;

/*--------- Remove Cart -----------*/
// Remove cart handler
handlers.cartRemove =function(data, callback){
    const acceptableMethods = ['delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._cartRemove[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Carts submethods
handlers._cartRemove = cartRemoveMethods;

/*--------- Carts -----------*/
// Order handler
handlers.order =function(data, callback){
    const acceptableMethods = ['post'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._order[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Carts submethods
handlers._order = orderMethods;
//----------.....---------


// Ping handler
handlers.ping =function(data, callback){
    // Callback a http status code, and a payload object
    callback(200,'pong');
}

// Not found handler
handlers.notFound = function(data, callback){
    callback(404);
}

module.exports = handlers;