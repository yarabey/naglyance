"use strict";

var db = {
	users: null
};

var common_createAnswer = function(){};
var common_createErrorAnswer = function(){};
var errors_get = function(){};

/**
 * Gets user with specify login and pass
 * @param {Object} args
 * @param {String} args.login
 * @param {String} args.password
 *
 * @return {Boolean} Is user in DB
 */
exports.isInDB = function(args) {
	var count = db.users.count({email: args.email});
	return common_createAnswer(count);
};

/**
 * Gets user with specify login
 * @param {String} email
 *
 * @return {Object} User
 */
exports.getByEmail = function(email) {
	var user = db.users.findOne({email: email});
	return common_createAnswer(user);
};

/**
 * Add user with params
 * @param {Object} user
 * @param {String} user.email
 * @param {String} user.password
 *
 * @return 
 */
exports.add = function(user) {
    var user = {
        _id: ObjectId(),
        email: user.email,
        password: user.password,
        role: "user"
    };
	db.users.insert(user);
    return common_createAnswer(user);
};