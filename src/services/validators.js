/*
 * Variables validation
 * 
 */

// Dependencies
const config = require('../config')
// Create container
const validator = {};


validator.validateEmail = (email)=>{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
        return (true)
    }
    return (false);
}

validator.validateToken = (token)=>{
    if(typeof(token) == 'string' && token.length == config.tokenLength){
        return true
    }else{
        return false
    }
}

validator.validateString = (str)=>{
    if(typeof(str) == 'string' && str.trim().length> 0){
        return true
    }else{
        return false
    }
}

validator.validatePassword = (pass)=>{
    if(typeof(pass) == 'string' && pass.trim().length> 6){
        return true
    }else{
        return false
    }
}

validator.validateObject = (obj)=>{
    if(typeof(obj) == 'object' && obj !== null){
        return obj;
    }else{
        return {};
    }
}

module.exports = validator;
