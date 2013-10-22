"use strict";

var db = {};

/**
   Error Codes of database answers

 1001: Container not found

 */
/**
 * Get error object by code
 * @param {Number} code Error code
 * @return {Object} Error object
 */
exports.get = function(code){
	switch (code){
		case 99: return {code: code, title: 'Ooops', message: 'Unknown operation'}
		case 100: return {code: code, title: 'Data base operation', message: 'Can not execute database function: #{name}(#{args}). Error: #{error}'}
		default: return {code: code, title: 'Unknown error', message: 'Error not found by this code'}
	};
};