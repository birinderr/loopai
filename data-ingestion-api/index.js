const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { addToQueue, startWorker } = require('./queueManager');
const { getStatus, initIngestion } = require('./statusStore');

const app = express();
app.use(express.json());

startWorker(); // Start the async processor

// POST /ingest
app.post('/ingest', (req, res) => {
    const { ids, priority } = req.body;
    if (!Array.isArray(ids) || !priority) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const ingestion_id = uuidv4();
    initIngestion(ingestion_id, ids, priority);
    addToQueue(ingestion_id, ids, priority);

    res.json({ ingestion_id });
});

// GET /status/:ingestion_id
app.get('/status/:id', (req, res) => {
    const status = getStatus(req.params.id);
    if (!status) return res.status(404).json({ error: "Not found" });
    res.json(status);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
