# CAP Monitoring Dashboard

This branch adds an operational monitoring application for the MOBI CAP application.

## What is monitored

- SFTP file ingestion
  - total files
  - completed files
  - failed files
  - processing files
  - row totals / valid rows / error rows
  - processing start/end timestamps
  - file error details
- Database transaction processing
  - transaction count
  - transaction errors
- Consolidation
  - consolidation count
  - pending posting
  - posted
  - posting failed
  - retry count
  - HTTP status
  - SAP reference document
- Audit
  - process name/type
  - success/warning/error messages
  - timestamps
- Last activity timestamps

## New files

- `srv/monitoring.cds`
- `srv/monitoring.js`
- `app/monitoring/`
- MTA and approuter changes

## Deploy

1. Checkout this branch:
   `git fetch origin feature/cap-monitoring`
   `git checkout feature/cap-monitoring`
   `git pull origin feature/cap-monitoring`

2. Install dependencies:
   `npm ci`

3. Build:
   `npm run build`

4. Deploy:
   `cf deploy mta_archives/archive.mtar --retries 1`

5. Open the deployed HTML5 application named **monitoring** from SAP BTP HTML5 Applications.

The monitoring UI calls:
`/monitoring/srv-api/odata/v4/mobi-monitoring`

The existing CAP service, HANA DB, XSUAA and app-router are reused. No new DB table is required for the first monitoring version.

## Important

This dashboard monitors the CAP business-processing data stored in HANA. It does not automatically provide SAP Integration Suite/CPI message-level monitoring such as CPI MPL/message IDs. A later CPI monitoring integration can be added if the CPI monitoring API/authentication details are provided.
