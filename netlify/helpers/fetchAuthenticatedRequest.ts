import { getAccessTokenFromCookie, getSPOAccessTokenCookie } from "../../src/lib/helpers/session";
import { getAccessTokenCookieName } from "./util";

type FunctionName = "session"

export const fetchAuthenticatedRequest = async <T>(input: RequestInfo, init?: RequestInit, isSPO = false): Promise<T> => {
    const accessToken = isSPO ? getSPOAccessTokenCookie() : getAccessTokenFromCookie();
    if (!accessToken) {
        // If there is no access token, we need to send them back to the login page.
        throw new Error("No access token found");
    }

    init.headers = { ...init.headers, [getAccessTokenCookieName(isSPO)]: accessToken.token };

    const result = await fetch(input, init);
    const response = await result.json();
    return response as T;
}