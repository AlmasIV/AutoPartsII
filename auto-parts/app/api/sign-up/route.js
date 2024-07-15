import credentialsAssertion from "@/app/api/utils/credentialsAssertion/credentialsAssertion.js";
import authenticate from "@/app/api/utils/authenticate/authenticate.js";
import getBadResponseMessage from "@/app/api/utils/getBadResponseMessage/getBadResponseMessage.js";

export async function POST(request) {
    const credentials = await request.json();
    const assertionInfo = credentialsAssertion(credentials);

    if(!assertionInfo.isValid) {
        return getBadResponseMessage(assertionInfo.message);
    }

    return await authenticate({
        email: credentials.email,
        password: credentials.password,
        passwordConfirmation: credentials.passwordConfirmation
    }, "https://localhost:7019/users/sign-up");
}