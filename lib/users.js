isAdminById = function(userId) {
    var user = Meteor.users.findOne(userId);
    return !!(user && isAdmin(user));
};
isAdmin = function(user){
    user = (typeof user === 'undefined') ? Meteor.user() : user;
    return !!user && !!user.isAdmin;
};
