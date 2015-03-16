Template.admin_actions.events = {
    'click .publish': function() {
        //Problems.update(this._id, {$set: { draft: false }});

    },
    'click .toggleSignup': function() {
        var toggled = !getSetting('disableUserSignup', false);
        var settings = Settings.find().fetch()[0];
        if (settings) {
            Settings.update(settings._id, {$set: {disableUserSignup: toggled}});
        } else {
            Settings.insert({disableUserSignup: toggled})
        }
    },
    'click .toggleAnswering': function() {
        var toggled = !getSetting('disableAnswering', false);
        var settings = Settings.find().fetch()[0];
        if (settings) {
            Settings.update(settings._id, {$set: {disableAnswering: toggled}});
        } else {
            Settings.insert({disableAnswering: toggled})
        }
    }
};

Template.admin_actions.helpers({
    disableSignUp: function() {
        return getSetting('disableUserSignup', false);
    },
    disableAnswering: function() {
        return getSetting('disableAnswering', false);
    }
});

