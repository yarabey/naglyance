var dbprovider = require('dbprovider');

exports.getDefault = function(context){
    dbprovider.executeStoredScript('albums_get', { id: context.data.id }, function (err, album) {
        if (err) {
            context.sendError(88, 'Временная проблема с базой данных', 'Надо подождать.', 'home/auth');
            return;
        }
        if (!album) {
            context.sendError(88, 'Альбом не найден', 'Что-то не так', '/');
            return;
        }
        album.photos = album.photos.map(function (photo) {
            return {
                _id: photo._id,
                medium: '/img/' + photo.medium
            };
        });
        context.send({ name: album.name, place: album.place, date: album.date, photos: JSON.stringify(album.photos), title: 'НаГлянце.рф' }, 'album');
    });
};

exports.postSaveAlbum = function(context){
    if (!context.data.id)
        dbprovider.executeStoredScript("albums_add", {
                photos: context.data.photos,
                date: new Date(context.data.date),
                name: context.data.name,
                place: context.data.place,
                createDate: new Date()
            },
            function(err, id) {
                if (!err)
                    context.send({});
                else
                    context.send({err: err});
            }
        );
    else
        dbprovider.executeStoredScript("albums_edit", {
                id: context.data.id,
                date: new Date(context.data.date),
                name: context.data.name,
                photos: context.data.photos,
                place: context.data.place
            },
            function(err, id) {
                if (!err)
                    context.send({});
                else
                    context.send({err: err});
            }
        );
};

exports.postDeleteAlbum = function(context){
    dbprovider.executeStoredScript("albums_delete", {id: context.data.id}, function(err, id) {
            if (!err)
                context.send({});
            else
                context.send({err: err});
        }
    );
};

exports.info = function(){
    return {
        permissions: {all: false, role:"admin"},
        actions: {
            "postSaveAlbum": {model:"album", data: {body: true}, validationRedirect: 'home', responseFormat: 'json'},
            "getDefault": {model:"album_default", data: {body: true}, validationRedirect: 'home'},
            "postDeleteAlbum": {model:"album_default", data: {body: true}, validationRedirect: 'home', responseFormat: 'json'}
        }
    };
};
