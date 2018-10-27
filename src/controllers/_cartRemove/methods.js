/*
 * Users routing -> http request  methods 
 * 
 */

// Dependencies
const deleteMethod = require('./methods/delete')

// Container
const method = {}

// Methods' map
method.delete = deleteMethod

module.exports = method;
