getSetting = function(setting, defaultValue) {
    var settings = Settings.find().fetch()[0];
    if (settings && (typeof settings[setting] !== 'undefined')) {
        return settings[setting];
    } else {
        return typeof defaultValue === 'undefined' ? '' : defaultValue;
    }
};


countSolved = function(answers) {
    return _.size(_.where(answers, {solved: true}));
};
