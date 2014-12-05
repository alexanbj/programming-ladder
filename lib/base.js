// array containing properties to be added to the settings schema on startup.
addToSettingsSchema = [];


templates = {}

getTemplate = function (name) {
    // if template has been overwritten, return this; else return template name
    return !!templates[name] ? templates[name] : name;
}