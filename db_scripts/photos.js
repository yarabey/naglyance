"use strict";

var db = {
	photos: null
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
exports.add = function(args) {
    var id = ObjectId();
	db.photos.insert({_id: id, small: args.small, medium: args.med, big: args.big, album: args.album, deleted: null});
    return common_createAnswer(id);
};

exports.delete = function(args) {
    db.photos.update({_id: ObjectId(args.id)}, {$set: {deleted: new Date()}});
};

exports.repair = function(args) {
    db.photos.update({_id: ObjectId(args.id)}, {$set: {deleted: null}});
};

exports.get_last = function(args) {
    var result = db.photos.find({album: {$ne: 0}, deleted: null}, { small: 1 }).sort({ $natural: -1 }).limit(args.count).toArray();;
    return common_createAnswer(result);
};