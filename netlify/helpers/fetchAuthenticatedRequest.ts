import { HEADER_JWT_ACCESS_TOKEN } from "../../src/lib/constants";
import { getAccessTokenFromCookie } from "../../src/lib/helpers/session";

type FunctionName = "session"

export const fetchAuthenticatedRequest = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
    const accessToken = getAccessTokenFromCookie();
    if (!accessToken) {
        // If there is no access token, we need to send them back to the login page.
        throw new Error("No access token found");
    }

    init.headers = { ...init.headers, [HEADER_JWT_ACCESS_TOKEN]: accessToken.token };

    const result = await fetch(input, init);
    const response = await result.json();
    return response as T;
}