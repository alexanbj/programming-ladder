settingsSchemaObject = {
    userSignup: {
        type: Boolean,
        label: 'User sign up enabled'
    },
    answerSubmission: {
        type: Boolean,
        label: 'Problem answer submission enabled'
    }
}

Settings = new Meteor.Collection('settings');
SettingsSchema = new SimpleSchema(settingsSchemaObject);
Settings.attachSchema(SettingsSchema);

Settings.allow({
    insert: isAdminById,
    update: isAdminById,
    remove: isAdminById
});

