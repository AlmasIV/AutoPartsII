import credentialsAssertion from "@/app/api/utils/credentialsAssertion/credentialsAssertion.js";
import authenticate from "@/app/api/utils/authenticate/authenticate.js";
import getResponse from "@/app/api/utils/getResponse/getResponse.js";

export async function POST(request) {
    const credentials = await request.json();
    const assertionInfo = credentialsAssertion(credentials, true);

    if(!assertionInfo.isValid) {
        return getResponse(assertionInfo.data);
    }

    return await authenticate({
        email: credentials.email,
        password: credentials.password
    }, `${process.env.API_URL}/users/log-in`, true);
}