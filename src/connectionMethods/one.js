// @flow

import type {
  InternalQueryOneFunctionType
} from '../types';
import {
  DataIntegrityError,
  NotFoundError
} from '../errors';
import {
  createUlid
} from '../utilities';
import log from '../Logger';
import query from './query';

/**
 * Makes a query and expects exactly one result.
 *
 * @throws NotFoundError If query returns no rows.
 * @throws DataIntegrityError If query returns multiple rows.
 */
const one: InternalQueryOneFunctionType = async (connection, clientConfiguration, rawSql, values, queryId = createUlid()) => {
  const {
    rows
  } = await query(connection, clientConfiguration, rawSql, values, queryId);

  if (rows.length === 0) {
    log.error({
      queryId
    }, 'NotFoundError');

    throw new NotFoundError();
  }

  if (rows.length > 1) {
    log.error({
      queryId
    }, 'DataIntegrityError');

    throw new DataIntegrityError();
  }

  return rows[0];
};

export default one;