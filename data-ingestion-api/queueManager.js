const { updateBatchStatus, ingestions, priorityOrder } = require('./statusStore');

let jobQueue = [];

function addToQueue(ingestion_id, ids, priority) {
    jobQueue.push({
        ingestion_id,
        priority,
        created: Date.now()
    });
}

function startWorker() {
    setInterval(async () => {
        if (jobQueue.length === 0) return;

        // Sort by priority, then time
        jobQueue.sort((a, b) => {
            const p1 = priorityOrder[a.priority];
            const p2 = priorityOrder[b.priority];
            return p1 !== p2 ? p1 - p2 : a.created - b.created;
        });

        const job = jobQueue[0];
        const ingestion = ingestions[job.ingestion_id];
        if (!ingestion) return;

        const batch = ingestion.batches.find(b => b.status === "yet_to_start");
        if (batch) {
            updateBatchStatus(job.ingestion_id, batch.batch_id, "triggered");
            await simulate(batch.ids); // simulate processing
            updateBatchStatus(job.ingestion_id, batch.batch_id, "completed");
        } else {
            jobQueue.shift(); // all batches processed
        }
    }, 5000); // 1 batch per 5 seconds
}

function simulate(ids) {
    return new Promise(resolve => {
        console.log("Processing:", ids);
        setTimeout(() => {
            console.log("Completed:", ids);
            resolve();
        }, 1000); // Simulated 1s per batch
    });
}

module.exports = {
    addToQueue,
    startWorker
};
