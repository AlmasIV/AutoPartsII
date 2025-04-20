import credentialsAssertion from "@/global-utils/validators/credentialsAssertion.js";
import authenticate from "@/global-utils/validators/authenticate.js";
import getResponse from "@/global-utils/response-initializer/getResponse.js";

export async function POST(request) {
    const credentials = await request.json();
    const assertionInfo = credentialsAssertion(credentials, true);
    console.log("Log in was called. Trying to log in.");

    if(!assertionInfo.isValid) {
        return getResponse(assertionInfo.data, 400, "Bad Request");
    }

    return await authenticate({
        email: credentials.email,
        password: credentials.password
    }, `${process.env.API_URL}/users/log-in`, true);
}