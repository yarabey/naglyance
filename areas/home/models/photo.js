var schema = require("schema");

module.exports = function(controllerName, actionName, clientData) {
    if (this.id)
        this.id = schema.id;
};