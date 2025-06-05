# Data Ingestion API (Node.js + Express)

## Features
- /ingest: Accepts list of IDs + priority
- /status/:id: Returns status of the ingestion request
- Priority queue processing
- 3 IDs per batch, 1 batch every 5 seconds
- In-memory status tracking

## Run Locally
```bash
git clone https://github.com/birinderr/loopai.git
cd data-ingestion-api
npm install
node index.js
