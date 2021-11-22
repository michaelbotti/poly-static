import { mocked } from 'ts-jest/utils'
import { HandlerEvent } from '@netlify/functions';
import lambdaTester from 'lambda-tester';
import { HEADER_PHONE, HEADER_PHONE_AUTH } from '../../src/lib/constants';
import { handler } from '../functions/verify';
import { fetchNodeApp } from "../helpers/util";

jest.mock('../helpers/firebase');
jest.mock('../helpers/util');

describe('Verify tests', () => {
  const event: HandlerEvent = {
    rawUrl: '',
    rawQuery: '',
    path: '',
    httpMethod: '',
    headers: {
      [HEADER_PHONE]: undefined,
      [HEADER_PHONE_AUTH]: undefined,
    },
    multiValueHeaders: undefined,
    queryStringParameters: undefined,
    multiValueQueryStringParameters: undefined,
    body: '',
    isBase64Encoded: false
  };

  it('Should fail when email address is not provided', async () => {
    await lambdaTester(handler).event(event).expectResolve(result => {
      expect(result.statusCode).toBe(400);
      expect(result.body).toBe('Missing email address.');
    })
  });

  it('Should fail when phone auth code is not provided', async () => {
    const updatedEvent = { ...event, headers: { [HEADER_PHONE]: '+123456789' } };
    await lambdaTester(handler).event(updatedEvent).expectResolve(result => {
      expect(result.statusCode).toBe(400);
      expect(result.body).toBe('Missing auth code.');
    })
  });

  it('Should return data from fetchNodeApp successfully', async () => {
    // @ts-ignore
    mocked(fetchNodeApp).mockResolvedValue({ status: 200, json: () => Promise.resolve({ test: 'data' }) });
    const updatedEvent = { ...event, headers: { [HEADER_PHONE]: '+123456789', [HEADER_PHONE_AUTH]: '1234' } };
    await lambdaTester(handler).event(updatedEvent).expectResolve(result => {
      expect(result.statusCode).toBe(200);
      expect(result.body).toBe("{\"test\":\"data\"}");
    })
  });
});
