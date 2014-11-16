
Users = new SimpleSchema({
    username: {
        type: String,
        regEx: /^[a-z0-9A-Z_]{3,15}$/
    },
    emails: {
        type: [Object],
        optional: true
        // this must be optional if you also use other login services like facebook,
        // but if you use only accounts-password, then it can be required
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Object,
        optional: true,
        blackbox: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    isAdmin: {
        type: Boolean,
        defaultValue: false
    },
    score: {
        type: Number,
        defaultValue: 0
    },
    solved: {
        type: Number,
        defaultValue: 0
    },
    linje: {
        type: Number,
        allowedValues: [0, 1],
        defaultValue: 0,
        autoform: {
            options: [
                {label: 'Online', value: 0},
                {label: 'Abakus', value: 1}
            ],
            noselect: true
        }
    }
});

Meteor.users.attachSchema(Users);


Meteor.users.allow({
    insert: function() { return true; },
    update: function() { return true; },
    remove: function() { return true; }
});

if (Meteor.isServer) {
    Meteor.users.after.remove(function (userId, user) {
        Problems.update({}, {$pull: {answers: {userId: user._id}}}, {multi: true});
    });
}
