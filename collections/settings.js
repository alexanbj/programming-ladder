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

// add any extra properties to settingsSchemaObject (provided by packages for example)
_.each(addToSettingsSchema, function(item){
    settingsSchemaObject[item.propertyName] = item.propertySchema;
});

Settings = new Mongo.Collection('settings');
SettingsSchema = new SimpleSchema(settingsSchemaObject);
Settings.attachSchema(SettingsSchema);

Settings.allow({
    insert: isAdminById,
    update: isAdminById,
    remove: isAdminById
});

