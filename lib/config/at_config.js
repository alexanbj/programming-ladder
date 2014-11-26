T9n.setLanguage('no_NB');


AccountsTemplates.addFields([
    {
        _id: 'username',
        type: 'text',
        displayName: 'Brukernavn (synlig)',
        required: true,
        minLength: 5,
        trim: true
    },
    {
        _id: 'name',
        type: 'text',
        displayName: 'Navn (ikke synlig, kun for å kontake premievinnere)',
        required: true,
        trim: true,
        placeholder: 'Ola Nordmann'
    },
    {
        _id: 'phone',
        type: 'tel',
        displayName: 'Telefonnummer (ikke synlig, kun for å kontakte premievinnere)',
        required: true,
        placeholder: '99 99 99 99',
        trim: true,
        func: function (number) {
            if (Meteor.isServer) {
                try {
                    var util = LibPhoneNumber.phoneUtil;
                    var parsed = util.parse(number, 'NO');
                    return !util.isValidNumber(parsed); // false means no validation error

                } catch (err) {
                    return true; // true means validation error
                }
            } else {
                return false;
            }
        },
        errStr: 'Ugyldig telefonnummer'
    }

]);

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');

AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: false,
    sendVerificationEmail: false,
    enforceEmailVerification: false,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: false,
    showValidating: true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Texts
    texts: {
        button: {
            signUp: 'Registrer'
        },
        signUpLink_link: "Registrer",
        signUpLink_pre: "Ingen konto?"
    }
});


