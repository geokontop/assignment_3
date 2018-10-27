/*
 * Create and export configuration variables
 *
 */

// Dependencies
const keys = require('./private')

// Container for all environments
const environments = {};

const stripe = {
  "testAPIkey" : {
    "Publishable" : keys.stripe.Publishable,
    "Secret" : keys.stripe.Secret
  }  
}

const mailgun = {
  'domainName' : keys.mailgun.domainName,
  'apiKey' : keys.mailgun.apiKey,
  'from' : keys.mailgun.from
}

// Staging (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'tokenLength' : 20,
  'hashingSecret' : 'this Is a secret',
  'admin' : 'admin@admin.com',
  'stripe' : stripe,
  'mailgun' : mailgun,
  'templateGlobals' : {
    'appName' : 'assignment 3',
    'companyName' : 'Pizza Napolitana',
    'yearCreated' : '2018',
    'baseUrl' : 'http://localhost:3000'
  }
};

// Production environment
environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'tokenLength' : 20,
  'hashingSecret' : 'this is also a secret',
  'admin' : 'admin@admin.com',
  'templateGlobals' : {
    'appName' : 'assignment 3',
    'companyName' : 'Pizza Napolitana',
    'yearCreated' : '2018',
    'baseUrl' : 'http://localhost:5000'
  }
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;

