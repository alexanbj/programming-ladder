Accounts.validateNewUser(function (user) {
    if (getSetting('disableUserSignup', false)) {
        throw new Meteor.Error(403, "User sign up is currently disabled.");
    }
    return user
});