# Data Ingestion API

## Overview

This project implements a simple asynchronous data ingestion API with rate limiting and priority-based batch processing.  
It exposes two endpoints:

- `POST /ingest` — to submit data ingestion requests with a list of IDs and a priority.
- `GET /status/:ingestion_id` — to check the status of an ingestion request.


## Features

- Processes IDs in batches of 3 asynchronously.
- Enforces a rate limit of 1 batch per 5 seconds.
- Supports priority-based queueing (`HIGH`, `MEDIUM`, `LOW`).
- Tracks batch and overall ingestion status (`yet_to_start`, `triggered`, `completed`).
- Simulates external API data fetching with delay and static response.


## Technologies Used

- Node.js with Express.js
- In-memory data store for simplicity (can be swapped with DB)
- `uuid` for unique IDs
- Async batch processing with rate limiting

## Run Locally
```bash
git clone https://github.com/birinderr/loopai.git
cd data-ingestion-api
npm install
node index.js
