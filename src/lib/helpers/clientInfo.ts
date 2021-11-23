import * as buffer from 'buffer';

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
    canvasPrint?: string
}

const toSha256Hash = async (data): Promise<string> => {
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export const buildClientAgentInfo = async (): Promise<string> => {
    if (typeof window === undefined) {
        return '';
    }

    let response;
    await import('clientjs').then(({ ClientJS }) => {
        const clientAgent = new ClientJS();

        response = async () => {
            buffer.Buffer.from(JSON.stringify({
                userAgent: clientAgent.getUserAgent(),
                printScreen: clientAgent.getScreenPrint(),
                colorDepth: clientAgent.getColorDepth(),
                currentResolution: clientAgent.getCurrentResolution(),
                availableResolution: clientAgent.getAvailableResolution(),
                dpiX: clientAgent.getDeviceXDPI(),
                dpiY: clientAgent.getDeviceYDPI(),
                pluginList: clientAgent.getPlugins(),
                fontList: await toSha256Hash(clientAgent.getFonts()),
                localStorage: clientAgent.isLocalStorage(),
                sessionStorage: clientAgent.isSessionStorage(),
                timeZone: clientAgent.getTimeZone(),
                language: clientAgent.getLanguage(),
                systemLanguage: clientAgent.getSystemLanguage(),
                cookies: clientAgent.isCookie(),
                canvasPrint: await toSha256Hash(clientAgent.getCanvasPrint())
            })).toString('base64');
        }
    });

    return response;
}

