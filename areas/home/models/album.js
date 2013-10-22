var schema = require("schema");

module.exports = function(controllerName, actionName, clientData) {
    if (this.id)
        this.id = schema.id;
    this.date = schema.date;
    this.name = schema.album_name;
};
