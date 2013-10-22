var schema = require("schema");

module.exports = function(controllerName, actionName, clientData) {
    if (this.page)
        this.page = schema.number;
};
