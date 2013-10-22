var dbprovider = require('dbprovider'),
    path = require('path'),
    config = require('config'),
    crypto = require('crypto'),
    fs = require('fs'),
    cp = require('child_process');

exports.getUploadModal = function(context){
    context.send({}, 'UploadModal');
};

exports.postUploadPhoto = function(context){
    fs.readFile(context.files.photo.path, function (err, data) {
        var name = context.files.photo.name,
            ext = path.extname(name);
        var hash = crypto.createHash('md5').update(name + (new Date())).digest('hex');
        var newPath = path.join(config.app.rootPath, 'assets/img/Photos/' + hash + ext);
        fs.writeFile(newPath, data, function (err) {
            saveImage(newPath, hash, ext, function (err, args) {
                if (!err) {
                    dbprovider.executeStoredScript("photos_add", {small: args.small, big: args.big, med: args.med, album: 0}, function(err, id) {
                        if (!err)
                            context.send({item: {id: id, medium: path.join('/img', args.med)}});
                        else
                            context.send({err: err});
                    });
                }
            });
        });
    });
};

exports.postDeletePhoto = function(context){
    dbprovider.executeStoredScript("photos_delete", {id: context.data.id}, function(err) {
        context.send({err: err});
    });
};

exports.postRepairPhoto = function(context){
    console.log(context.data.id);
    dbprovider.executeStoredScript("photos_repair", {id: context.data.id}, function(err) {
        context.send({err: err});
    });
};

function saveImage(input, hash, ext, callback) {
    var outPath = path.join(config.app.rootPath, 'assets/img/Photos/' + hash + '.med' + ext);
    var command = [
        'convert',
        input,
        '-thumbnail 400x270^',
        '-gravity', 'Center',
        '-quality', 80,
        '-extent 400x270',
        outPath
    ];
    cp.exec(command.join(' '), function(err) {
        if (err) {
            callback(err);
            return;
        }

        command = [
            'composite',
            '-dissolve', '100%',
            '-gravity', 'SouthWest',
            '-quality', 80,
            path.join(config.app.rootPath, 'assets/img/logo.min.png'),
            outPath,
            outPath
        ];
        cp.exec(command.join(' '), function(err) {
            if (err) {
                callback(err);
                return;
            }
            command = [
                'composite',
                '-dissolve', '100%',
                '-gravity', 'SouthWest',
                '-quality', 80,
                path.join(config.app.rootPath, 'assets/img/logo.big.png'),
                input,
                path.join(config.app.rootPath, 'assets/img/Photos/' + hash + '.big' + ext)
            ];

            cp.exec(command.join(' '), function(err) {
                if (err) {
                    callback(err);
                    return;
                }
                command = [
                    'convert',
                    outPath,
                    '-resize 105x',
                    path.join(config.app.rootPath, 'assets/img/Photos/' + hash + '.min' + ext)
                ];
                cp.exec(command.join(' '), function (err) {
                    callback(err, {small: 'Photos/' + hash + '.min' + ext, med: 'Photos/' + hash + '.med' + ext, big: 'Photos/' + hash + ext});
                });
            });
        });
    });
};

exports.info = function(){
    return {
        permissions: {all: false, role:"admin"},
        actions: {
            "getUploadModal": {validationRedirect: 'home'},
            "postUploadPhoto": {model:"photo", data: {body: true}, validationRedirect: 'home', responseFormat: 'json'},
            "postDeletePhoto": {model:"photo", data: {body: true}, validationRedirect: 'home', responseFormat: 'json'},
            "postRepairPhoto": {model:"photo", data: {body: true}, validationRedirect: 'home', responseFormat: 'json'}
        }
    };
};
