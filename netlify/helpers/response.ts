import { HandlerResponse } from "@netlify/functions";

export const unauthorizedResponse: HandlerResponse = {
    statusCode: 401,
    body: JSON.stringify({
        error: true,
        message: "Unauthorized.",
    }),
};

export const botResponse: HandlerResponse = {
    statusCode: 422,
    body: JSON.stringify({
        message:
            "Our system thinks you might be a bot but we hope we're wrong. Please try again.",
    }),
}

export const responseWithMessage = (statusCode: number, message: string, error: boolean): HandlerResponse => ({
    statusCode,
    body: JSON.stringify({
        error,
        message
    })
})