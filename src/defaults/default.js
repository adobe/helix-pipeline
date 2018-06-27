const winston = require("winston");

/**
 * Constructs a pipeline function that is capable of
 * - reading OpenWhisk parameters
 * - calling a continuation function
 * - wrapping the response in a friendly response format
 * @param {Function} cont the continuation function 
 * @param {Object} params the OpenWhisk parameters
 * @returns {Function} a function to execute.
 */
module.exports.pipe = function(cont, params) {
    return function(params) {
        return cont(params);
    }
}

/**
 * 
 * @param {Function} cont the continuation function
 * @param {Object} params the OpenWhisk parameters
 * @returns {Function} the wrapped main function
 */
module.exports.pre = function(cont, params) {
    return cont;
}

/**
 * A standard cleanup function that takes OpenWhisk-style parameters and turns
 * them into an Express-style request object which is returned.
 * @param {Object} params Parameters following OpenWhisk convention, including __ow_method and __ow_headers for HTTP requests
 * @returns {Object} A req object that is equivalent to an Express request object, including a headers, method, and params field
 */
module.exports.before = function(params) {
    // use destructuring to drop __ow_headers and __ow_method from params
    const { __ow_headers, __ow_method, ...newparams } = params;

    return {
        request: {
            headers: params['__ow_headers'],
            params: newparams,
            method: params['__ow_method'],
        }
    };  
}

module.exports.after = function(params) {
    const { response, response: {status = 200, headers = { 'Content-Type': 'application/json' }, body = ''} } = params;
    return {
        statusCode: status,
        headers: headers,
        body: body
    }
}

module.exports.log = winston.createLogger({
    level: "debug",
    format: winston.format.simple(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "pipeline.log" })
    ]
  });