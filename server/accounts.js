Accounts.validateNewUser(function (user) {
    if (!getSetting('userSignup', true)) {
        throw new Meteor.Error(403, "User sign up is currently disabled.");
    }
    return user
});