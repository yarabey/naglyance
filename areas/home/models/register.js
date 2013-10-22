var schema = require("schema");

module.exports = function(controllerName, actionName, clientData) {
	this.login = schema.nickname;
	this.password = schema.nickname;
	this.repassword = schema.nickname;
	this.email = schema.email;
};