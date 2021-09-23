import { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';

import { ActiveSessionType, ReservedHandlesType } from '../../src/context/handleSearch';
import { HEADER_APPCHECK } from '../../src/lib/constants';
import { getFirebase, verifyAppCheck } from '../helpers';

const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const { headers } = event;
  if (!headers[HEADER_APPCHECK]) {
    return {
      statusCode: 403,
      body: 'Unauthorized.'
    }
  }

  const verified = await verifyAppCheck(headers[HEADER_APPCHECK] as string);
  if (!verified) {
    return {
      statusCode: 403,
      body: 'Unauthorized.'
    }
  }

  const database = (await getFirebase()).database();
  const reservedHandles = await (await database.ref('/reservedHandles').once('value', snapshot => snapshot.val())).val() as ReservedHandlesType;

    return {
        statusCode: 200,
        body: JSON.stringify(reservedHandles)
    }
}

export { handler };
