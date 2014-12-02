
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
    solved: {
        type: Number,
        defaultValue: 0
    },
    lastSolved: {
        type: Date,
        optional: true
    }
});

Meteor.users.attachSchema(Users);


Meteor.users.allow({
    update: function(userId, doc) {
        return isAdminById(userId) || userId == doc._id;
    },
    remove: isAdminById
});

Meteor.users.deny({
   update: function(userId, doc, fieldNames) {
       if (isAdminById(userId)) {
           return false;
       }
       return true; // Should probably be something profile related here eventually
   }
});

if (Meteor.isServer) {
    Meteor.users.after.remove(function (userId, user) {
        Problems.update({}, {$pull: {answers: {userId: user._id}}}, {multi: true});
    });
}
