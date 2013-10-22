"use strict";

var db = {
    albums: null,
    photos: null
};

var common_createAnswer = function(){};
var common_createErrorAnswer = function(){};
var errors_get = function(){};

exports.add = function(args) {
    var id = ObjectId();
    args.photos = args.photos.map(function (id) {
        return ObjectId(id);
    });
    db.albums.insert({_id: id, name: args.name, date: args.date, place: args.place, createDate: args.createDate});
    db.photos.update({_id: { $in: args.photos } }, {$set: {album: id}}, true, true);
    return common_createAnswer(id);
};

exports.edit = function(args) {
    var id = ObjectId(args.id);
    db.albums.update({_id: id}, {$set: {name: args.name, date: args.date, place: args.place}});
    args.photos = args.photos.map(function (id) {
        return ObjectId(id);
    });
    db.photos.update({_id: { $in: args.photos } }, {$set: {album: id}}, true, true);
    return common_createAnswer();
};

exports.delete = function(args) {
    var id = ObjectId(args.id);
    db.albums.remove({_id: id});
    db.photos.remove({album: id});
    return common_createAnswer();
};

exports.get_first = function(args) {
    var result = db.albums.find().sort({ createDate: -1 }).skip(args.skip || 0).limit(args.count).toArray();
    var photo;
    for (var i = 0, len = result.length; i < len; i++) {
        result[i].photos = db.photos.find({album: result[i]._id, deleted: null }, { small: 1, _id: 0 }).limit(28).toArray();
    }
    return common_createAnswer(result);
};

exports.get_count = function() {
    return common_createAnswer(db.albums.count());
};

exports.get_next = function(args) {
    var result = db.albums.find().sort({ createDate: -1 }).skip(args.page * args.count).limit(args.count).toArray();
    return common_createAnswer(result);
};

exports.get = function(args) {
    var id = ObjectId(args.id);
    var result = db.albums.findOne({_id: id});
    result && (result.photos = db.photos.find({album: id, deleted: null }, { medium: 1 }).toArray());
    return common_createAnswer(result);
};
