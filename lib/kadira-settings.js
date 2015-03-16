var kadiraAppIdProperty = {
    propertyName: 'kadiraAppId',
    propertyGroup: 'kadira',
    propertySchema: {
        type: String,
        optional: true,
        autoform: {
            private: true
        }
    }
}
addToSettingsSchema.push(kadiraAppIdProperty);

var kadiraAppSecretProperty = {
    propertyName: 'kadiraAppSecret',
    propertyGroup: 'kadira',
    propertySchema: {
        type: String,
        optional: true,
        autoform: {
            private: true
        }
    }
}
addToSettingsSchema.push(kadiraAppSecretProperty);