canEditById = function(userId, item){
    var user = Meteor.users.findOne(userId);
    return canEdit(user, item);
};

canEdit = function(user, item, returnError){
    var user=(typeof user === 'undefined') ? Meteor.user() : user;

    if (!user || !item){
        return returnError ? "no_rights" : false;
    } else if (isAdmin(user)) {
        return true;
    } else if (user._id!==item.userId) {
        return returnError ? "no_rights" : false;
    }else {
        return true;
    }
};