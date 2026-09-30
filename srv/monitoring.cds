using { mobi.db as db } from '../db/schema';

@requires: ['authenticated-user', 'system-user']
service MobiMonitoringService {
  @readonly
  @restrict: [{ grant: 'READ', to: 'Read' }, { grant: 'READ', to: 'OperationsTrigger' }]
  entity Audit as projection on db.MOBI_DB_AUDIT;

  @readonly
  @restrict: [{ grant: 'READ', to: 'Read' }, { grant: 'READ', to: 'OperationsTrigger' }]
  entity FileLogs as projection on db.MOBI_DB_FILELOG;

  @readonly
  @restrict: [{ grant: 'READ', to: 'Read' }, { grant: 'READ', to: 'OperationsTrigger' }]
  entity FileBatches as projection on db.MOBI_DB_FILEBATCH;

  @readonly
  @restrict: [{ grant: 'READ', to: 'Read' }, { grant: 'READ', to: 'OperationsTrigger' }]
  entity Transactions as projection on db.MOBI_DB_TRANSACTION;

  @readonly
  @restrict: [{ grant: 'READ', to: 'Read' }, { grant: 'READ', to: 'OperationsTrigger' }]
  entity ConsolidationHeaders as projection on db.MOBI_DB_CONSOLIDATIONHEADER;

  @readonly
  @restrict: [{ grant: 'READ', to: 'Read' }, { grant: 'READ', to: 'OperationsTrigger' }]
  entity ConsolidationLineItems as projection on db.MOBI_DB_CONSOLIDATIONLINEITEM;

  @readonly
  @restrict: [{ grant: 'READ', to: 'Read' }, { grant: 'READ', to: 'OperationsTrigger' }]
  entity Master as projection on db.MOBI_DB_MASTER;

  @readonly
  entity StatusCodes as projection on db.MOBI_DB_STATUS;

  type MonitoringSummary {
    filesTotal            : Integer;
    filesCompleted        : Integer;
    filesFailed           : Integer;
    filesInProcess        : Integer;
    auditErrors           : Integer;
    transactionsTotal     : Integer;
    transactionsWithError : Integer;
    consolidationTotal    : Integer;
    consolidationPending  : Integer;
    consolidationPosted   : Integer;
    consolidationFailed   : Integer;
    lastFileActivity      : Timestamp;
    lastConsolidation     : Timestamp;
    lastAuditActivity     : Timestamp;
  }

  function getSummary() returns MonitoringSummary;
}
