import {
    Handler,
    HandlerEvent,
    HandlerContext,
    HandlerResponse,
} from "@netlify/functions";
import { fetchNodeApp } from "../helpers/util";


export interface ClientAgentInfo {
    userAgent?: string,
    printScreen?: string,
    colorDepth?: string,
    currentResolution?: string,
    availableResolution?: string,
    dpiX?: string,
    dpiY?: string,
    pluginList?: string,
    fontList?: string,
    localStorage?: string,
    sessionStorage?: string,
    timeZone?: string,
    language?: string,
    systemLanguage?: string,
    cookies?: string,
    canasPrint?: string
}

interface ClientAgentInfoResponse {
  suspicious: boolean;
}

export interface ClientAgentInfoResponseBody extends ClientAgentInfoResponse {
  error: boolean;
  message?: string;
}

const handler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext
): Promise<HandlerResponse> => {

    const decoded = Buffer.from(event.body, 'base64').toString('binary');
    const agent = JSON.parse(decoded) as ClientAgentInfo

    // do checks on fields here
    if (!agent.userAgent) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Bad Request',
                data: false
            })
        }
    }
    // etc...

    const hash = crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(decoded))
        .then(console.log);

    try {
        const data: ClientAgentInfoResponseBody = await fetchNodeApp(`clientagent`, {
            method: 'POST',
            body: {
                hash: hash,
                agent: event.body
            }
        }).then(res => res.json())
        .catch(e => console.log(e));
        if (data.suspicious) {
            return {
                statusCode: 403
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({agentHash: hash}),
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: true,
                message: 'There was an error processing the client agent information'
            } as ClientAgentInfoResponseBody)
        };
    }
}

export { handler };