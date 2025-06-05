const { v4: uuidv4 } = require('uuid');

const ingestions = {};  // ingestion_id => { status, batches }
const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function initIngestion(id, ids, priority) {
    const batches = [];
    for (let i = 0; i < ids.length; i += 3) {
        const batch = {
            batch_id: uuidv4(),
            ids: ids.slice(i, i + 3),
            status: "yet_to_start"
        };
        batches.push(batch);
    }

    ingestions[id] = {
        priority,
        created: Date.now(),
        status: "yet_to_start",
        batches
    };
}

function getStatus(id) {
    const record = ingestions[id];
    if (!record) return null;

    const allStatuses = record.batches.map(b => b.status);
    let overall;

    if (allStatuses.every(s => s === "yet_to_start")) {
        overall = "yet_to_start";
    } else if (allStatuses.every(s => s === "completed")) {
        overall = "completed";
    } else {
        overall = "triggered"; // Mixed or any 'triggered' → triggered
    }

    return {
        ingestion_id: id,
        status: overall,
        batches: record.batches
    };
}


function updateBatchStatus(ingestion_id, batch_id, status) {
    const record = ingestions[ingestion_id];
    if (!record) return;
    const batch = record.batches.find(b => b.batch_id === batch_id);
    if (batch) batch.status = status;
}

module.exports = {
    ingestions,
    initIngestion,
    getStatus,
    updateBatchStatus,
    priorityOrder
};
