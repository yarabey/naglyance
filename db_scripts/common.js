"use strict";

var db = {
	containers: null,
	blobs: null
}, ObjectId;

/**
 * Return Ready Container ID
 * @param {String || ObjectId} parent Parent will be path or objectId
 * @returns {ObjectId || Boolean} Return objectId or false, when not found
 */
exports.getReallyParent = function(parent){
	if (parent instanceof ObjectId)
		return common_createAnswer(parent);

	var isObjectId = false;
	if (typeof parent === "string"){
		try{
			ObjectId(parent);
			isObjectId = true;
		}catch(e) {}
	}
	if (typeof parent === "string" && !isObjectId){
		var id = containers_getId({path: parent});
		if (id.error)
			return id;
		else{
			parent = id.response;
			if (parent)
				parent = ObjectId(parent);
		}
	}else if (parent != null)
		parent = ObjectId(parent);
	else
		parent = null;
	return common_createAnswer(parent);
};

/**
 * Create error answer
 * @param {Object} error
 * @param {Number} error.code Code of Error
 * @param {String} error.title Error Title
 * @param {String} error.message Error Message
 * @return {Object}
 */
exports.createErrorAnswer = function(error){
	return {
		error: {
			code: error.code,
			title: error.title,
			message: error.message
		}
	};
};

/**
 * Create answer
 * @param {Object} answer
 * @return {Object}
 */
exports.createAnswer = function(answer){
	return {
		response: answer
	};
}

/**
 * Get ObjectId from String or Object
 * @param {String || ObjectId || null} source
 * @returns {ObjectId || null}
 */
exports.getObjectId = function(source){
	if (!source) return null;
	if (typeof source === 'string')
		return ObjectId(source);
	else
		return source;
}

/**
 * Get container or blob by Id
 * @param {Object} args
 * @param {String} args._id
 */
exports.getObjectById = function(args){
	var _id = args._id;
	if (typeof _id === 'string') _id = ObjectId(_id);
	var entity = db.blobs.findOne({_id: _id});
	if (!entity){
		entity = db.containers.findOne({_id: _id});
		if (entity) entity.type = 1;
	}else entity.type = 2;
	return common_createAnswer(entity);
}
