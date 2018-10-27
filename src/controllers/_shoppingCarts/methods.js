/*
 * Shopping carts routing ->  http request methods 
 * 
 */

// Dependencies
const post = require('./methods/post')
const get = require('./methods/get')
const put = require('./methods/put')
const deleteMethod = require('./methods/delete')

// Container
const method = {}

// Methods' map
method.post = post;
method.get = get;
method.put = put;
method.delete = deleteMethod;

module.exports = method;
