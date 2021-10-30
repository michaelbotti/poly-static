import { fetch } from 'cross-fetch';

export const getNodeEndpointUrl = () => process.env.NODE_ENV !== 'production'
  ? process.env.NODEJS_APP_TESTNET_URL
  : process.env.NODEJS_APP_MAINNET_URL

export const fetchNodeApp = async (
  endpoint: string,
  params: any = {}
): Promise<Response> => {
  const token = Buffer.from(
    `${process.env.NODEJS_APP_USERNAME}:${process.env.NODEJS_APP_PASSWORD}`
  ).toString('base64');

  const { headers, ...rest } = params;
  const baseUrl = getNodeEndpointUrl();

  return fetch(
    `${baseUrl}/${endpoint}`,
    {
      headers: {
        'Authorization': `Basic ${token}`,
        ...headers,
      },
      ...rest
    }
  )
}
