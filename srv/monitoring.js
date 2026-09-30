'use strict';

const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {
  this.on('getSummary', async () => {
    const [
      filesTotal, filesCompleted, filesFailed, filesInProcess, auditErrors,
      transactionsTotal, transactionsWithError, consolidationTotal,
      consolidationPending, consolidationPosted, consolidationFailed,
      lastFileActivity, lastConsolidation, lastAuditActivity
    ] = await Promise.all([
      count('mobi.db.MOBI_DB_FILELOG'),
      count('mobi.db.MOBI_DB_FILELOG', { STATUS: 'COMPLETED' }),
      count('mobi.db.MOBI_DB_FILELOG', { STATUS: 'FAILED' }),
      count('mobi.db.MOBI_DB_FILELOG', { STATUS: 'PROCESSING' }),
      count('mobi.db.MOBI_DB_AUDIT', { MESSAGE_TYPE: 'E' }),
      count('mobi.db.MOBI_DB_TRANSACTION'),
      count('mobi.db.MOBI_DB_TRANSACTION', { STATUS_CODE: '042' }),
      count('mobi.db.MOBI_DB_CONSOLIDATIONHEADER'),
      count('mobi.db.MOBI_DB_CONSOLIDATIONHEADER', { STATUS_CODE: '060' }),
      count('mobi.db.MOBI_DB_CONSOLIDATIONHEADER', { STATUS_CODE: '061' }),
      count('mobi.db.MOBI_DB_CONSOLIDATIONHEADER', { STATUS_CODE: '062' }),
      maxTimestamp('mobi.db.MOBI_DB_FILELOG', 'CREATED_TIMESTAMP'),
      maxTimestamp('mobi.db.MOBI_DB_CONSOLIDATIONHEADER', 'CREATED_TIMESTAMP'),
      maxTimestamp('mobi.db.MOBI_DB_AUDIT', 'CREATED_TIMESTAMP')
    ]);

    return {
      filesTotal, filesCompleted, filesFailed, filesInProcess, auditErrors,
      transactionsTotal, transactionsWithError, consolidationTotal,
      consolidationPending, consolidationPosted, consolidationFailed,
      lastFileActivity, lastConsolidation, lastAuditActivity
    };
  });
});

async function count(entity, where) {
  const db = await cds.connect.to('db');
  const query = SELECT.one.from(entity).columns('count(*) as count');
  if (where) query.where(where);
  const row = await db.run(query);
  return Number(row?.count || 0);
}

async function maxTimestamp(entity, column) {
  const db = await cds.connect.to('db');
  const row = await db.run(SELECT.one.from(entity).columns(`max(${column}) as value`));
  return row?.value || null;
}
