import credentialsAssertion from "@/app/api/utils/credentialsAssertion/credentialsAssertion.js";
import authenticate from "@/global-utils/validators/authenticate.js";
import getResponse from "@/app/api/utils/getResponse/getResponse.js";

export async function POST(request) {
    const credentials = await request.json();
    const assertionInfo = credentialsAssertion(credentials);

    if(!assertionInfo.isValid) {
        return getResponse(assertionInfo.message);
    }

    return await authenticate({
        email: credentials.email,
        password: credentials.password,
        passwordConfirmation: credentials.passwordConfirmation
    }, `${process.env.API_URL}/users/sign-up`);
}