getSetting = function(setting, defaultValue){
    var settings = Settings.find().fetch()[0];

    if (settings && (typeof settings[setting] !== 'undefined')) { // look in Settings collection
        return settings[setting];

    } else if (typeof defaultValue !== 'undefined') { // fallback to default
        return  defaultValue;

    } else { // or return undefined
        return undefined;
    }
};