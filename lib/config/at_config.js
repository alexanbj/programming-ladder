T9n.setLanguage('no_NB');


AccountsTemplates.addFields([
    {
        _id: 'username',
        type: 'text',
        displayName: 'Brukernavn (synlig)',
        required: true,
        minLength: 3,
        trim: true,
        re: /^[a-z0-9A-Z_]{3,15}$/,
        errStr: 'Ugyldig brukernavn'
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
        re: /^(?=.*\d)(?:[\d ]+)$/, //only digits and whitespaces
        func: function(value) {
            return value.replace(/\D/g, '').length < 8; // check if the length of the string is at least 8 after removing everything but digits
        },
        errStr: 'Ugyldig telefonnummer (kun siffer og mellomrom aksepteres)'
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
        signUpLink_pre: "Ingen konto?",
        title: {
            signUp: "Opprett konto"
        }
    }
});


