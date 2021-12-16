import { JwtPayload, Secret, decode } from 'jsonwebtoken';
import { getS3 } from ".";

type SecretContext = 'access' | 'session'

export interface AccessTokenPayload extends JwtPayload {
  emailAddress: string;
}

export const decodeAccessToken = (token: string): string | JwtPayload => {
  return decode(token);
}

export const getSecret = async (context: SecretContext = 'session'): Promise<Secret | null> => {
  const s3 = getS3();

  const Key = process.env[`MY_AWS_TOKEN_KEY_${context.toUpperCase()}`];

  try {
    const res = await s3
      .getObject({
        Bucket: process.env.MY_AWS_BUCKET || "",
        Key: Key || "",
      })
      .promise();

    const secret = res?.Body
      ? res.Body.toString("utf-8") as Secret
      : null;

    return secret;
  } catch (e) {
    throw new Error(e);
  }
}
