import { Secret } from 'jsonwebtoken';
import { getS3 } from ".";

export const getSecret = async (): Promise<Secret|null> => {
  const s3 = getS3();
  const res = await s3
    .getObject({
      Bucket: process.env.MY_AWS_BUCKET || "",
      Key: process.env.MY_AWS_JWT_SECRET_KEY || "",
    })
    .promise();

  const secret = res?.Body
    ? res.Body.toString("utf-8") as Secret
    : null;

  return secret;
}
