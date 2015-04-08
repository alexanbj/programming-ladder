settingsSchemaObject = {
    disableUserSignup: {
        type: Boolean,
        label: 'Disable user signup',
        defaultValue: false
    },
    disableAnswering: {
        type: Boolean,
        label: 'Disable problem answering',
        defaultValue: false
    },
    disableComments: {
        type: Boolean,
        label: 'Disable comments',
        defaultValue: false
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

