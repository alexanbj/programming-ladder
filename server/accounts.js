Accounts.onCreateUser(function (options, user) {
    user.score = 0
    user.solved = 0
    user.isAdmin = false
    user.linje = 0
    return user;
});

Accounts.validateNewUser(function (user) {
    if (!getSetting('userSignup', true)) {
        throw new Meteor.Error(403, "User sign up is currently disabled.");
    }
    return user
});