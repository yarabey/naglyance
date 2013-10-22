// Home: Controller
var dbprovider = require('dbprovider');

//Route GET /home
exports.getDefault = function(context){;
    if (!context.data.page) {
        dbprovider.executeStoredScript('albums_get_first', { count: 6 }, function (err, albums) {
            if (err) {
                context.sendError(88, 'Временная проблема с базой данных', 'Надо подождать.', '/');
                return;
            }
            dbprovider.executeStoredScript('photos_get_last', { count: 21 }, function (err, photos) {
                if (err) {
                    context.sendError(88, 'Временная проблема с базой данных', 'Надо подождать.', '/');
                    return;
                }
                context.send({albums: JSON.stringify(albums), photos: JSON.stringify(photos), title: 'НаГлянце.рф'}, 'default');
            });
        });
    }
    else {
        dbprovider.executeStoredScript('albums_get_first', { count: 6, skip: (context.data.page - 1) * 6 }, function (err, albums) {
            if (err) {
                context.sendError(88, 'Временная проблема с базой данных', 'Надо подождать.', '/');
                return;
            }
            dbprovider.executeStoredScript('albums_get_count', {}, function (err, count) {
                if (err) {
                    context.sendError(88, 'Временная проблема с базой данных', 'Надо подождать.', '/');
                    return;
                }
                context.send({albums: JSON.stringify(albums), title: 'НаГлянце.рф - Отчёты - Страница ' + context.data.page, pages: count/6, page: context.data.page}, 'albums');
            });
        });
    }
};

exports.info = function(){
	return {
		permissions: {all: false, role:"admin"},
		actions: {
			"getDefault": {model: "default", data: {query: ["page"]}, validationRedirect: 'home'}
		}
	};
};