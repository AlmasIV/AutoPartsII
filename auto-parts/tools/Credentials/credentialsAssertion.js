import isEmail from "validator/lib/isEmail.js";

export default function credentialsAssertion(credentials, isLogIn = false){
    const email = credentials.email;
    const password = credentials.password;
    const passwordConfirmation = credentials.passwordConfirmation;

    if (!isEmail(email)) {
        return {
            isValid: false,
            message: "Enter valid email address."
        };
    }
    if (password.length < 8) {
        return {
            isValid: false,
            message: "Password's minimal length must be 8 characters."
        };
    }
    if (!isLogIn && password !== passwordConfirmation) {
        return {
            isValid: false,
            message: "Password confirmation and password must be equal."
        };
    }

    return {
        isValid: true
    };
}