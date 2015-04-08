UI.registerHelper('isAdmin', function() {
    return isAdmin(Meteor.user());
});

UI.registerHelper('formatDate', function(datetime, format) {
    if (datetime) {
        return moment(datetime).format(format);
    } else {
        return "";
    }
});

UI.registerHelper('isDateBeforeNow', function(date) {
    return date > Date.now();
});

UI.registerHelper('isDateAfterNow', function(date) {
    return date < Date.now();
});

UI.registerHelper('getSetting', function(setting, defaultArgument){
    setting = getSetting(setting, defaultArgument);
    return setting;
});
