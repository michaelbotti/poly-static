import { fetch } from 'cross-fetch';

/**
 * Verifies against ReCaptcha.
 * @param token
 * @param ip
 * @returns
 */
export const passesRecaptcha = async (
    token: string
): Promise<boolean> => {
    const recaptcha_url = new URL(
        "https://www.google.com/recaptcha/api/siteverify"
    );
    recaptcha_url.searchParams.set("secret", process.env.RECAPTCHA_SECRET || "");
    recaptcha_url.searchParams.set("response", token);

    const { success, score, action } = (await (
        await fetch(recaptcha_url.toString(), {
            method: "POST",
        })
    ).json()) as { success: boolean; score: Number; action: string };

    console.log(success, score);

    return success && score >= 0.6;
};
