import * as buffer from 'buffer';
import { ClientJS } from 'clientjs';

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

export const buildClientAgentInfo = (): string => {
    if (typeof window === undefined) {
        return '';
    }

    const clientAgent = new ClientJS();
    return buffer.Buffer.from(JSON.stringify({
        userAgent: clientAgent.getUserAgent(),
        printScreen: clientAgent.getScreenPrint(),
        colorDepth: clientAgent.getColorDepth(),
        currentResolution: clientAgent.getCurrentResolution(),
        availableResolution: clientAgent.getAvailableResolution(),
        dpiX: clientAgent.getDeviceXDPI(),
        dpiY: clientAgent.getDeviceYDPI(),
        pluginList: clientAgent.getPlugins(),
        fontList: clientAgent.getFonts(),
        localStorage: clientAgent.isLocalStorage(),
        sessionStorage: clientAgent.isSessionStorage(),
        timeZone: clientAgent.getTimeZone(),
        language: clientAgent.getLanguage(),
        systemLanguage: clientAgent.getSystemLanguage(),
        cookies: clientAgent.isCookie(),
        canvasPrint: clientAgent.getCanvasPrint()
    })).toString('base64');
}

