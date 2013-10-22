// Control Panel: Error Controller

//Route GET /home/error
exports.getDefault = function(context) {
	context.redirect(301, "/home/error/404");
};

//Route GET /home/error/404
exports.get404 = function(context) {
	context.response.status(404);
	context.send();
};

//Route GET /home/error/404
exports.getMessage = function(context) {
	context.send();
};

exports.info = function(){
	return {
		permissions: {all: true}
	};
};