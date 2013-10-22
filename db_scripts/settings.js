"use strict";

var db = {
	settings: null
};

var common_createAnswer = function(){};
var common_createErrorAnswer = function(){};
var errors_get = function(){};

/**
 * Gets settings with specify names
 * @param {Object} args
 * @param {Array<String>} args.names
 * @param {Boolean} [args.isList]
 *
 * @return {Array || Object} Collection or List of setting items
 */
exports.get = function(args) {
	var items = db.settings.find({key: {$in: args.names}}).toArray();
	if(args.isList) {
		var set = {};
		items.forEach(function(item) {
			set[item.key] = item.value;
		});
		return common_createAnswer(set);
	} else {
		return common_createAnswer(items);
	}
};

/**
 * Update settings
 * @param {Object} args Set of key value pairs
 *
 * @return {Boolean} Always true
 */
exports.update = function(args) {
	for(var p in args) {
		if(args.hasOwnProperty(p)) {
			db.settings.update({key: p}, {$set: {value: args[p]}});
		}
	}
	return common_createAnswer(true);
};