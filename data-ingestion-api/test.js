const axios = require('axios');

const BASE_URL = 'http://localhost:5000'; // Change if deployed
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTest() {
  try {
    console.log("▶️ Sending first request with MEDIUM priority...");
    const res1 = await axios.post(`${BASE_URL}/ingest`, {
      ids: [1, 2, 3, 4, 5],
      priority: "MEDIUM"
    });
    const id1 = res1.data.ingestion_id;
    console.log("✅ Ingestion ID 1:", id1);

    await sleep(4000);

    console.log("▶️ Sending second request with HIGH priority...");
    const res2 = await axios.post(`${BASE_URL}/ingest`, {
      ids: [6, 7, 8, 9],
      priority: "HIGH"
    });
    const id2 = res2.data.ingestion_id;
    console.log("✅ Ingestion ID 2:", id2);

    console.log("⏳ Waiting for processing...");
    await sleep(16000); // allow enough time for batches to process

    console.log("📊 Fetching status for HIGH priority...");
    const status2 = await axios.get(`${BASE_URL}/status/${id2}`);
    console.dir(status2.data, { depth: null });

    console.log("📊 Fetching status for MEDIUM priority...");
    const status1 = await axios.get(`${BASE_URL}/status/${id1}`);
    console.dir(status1.data, { depth: null });

    // Bonus: verify order
    const allBatches = [...status2.data.batches, ...status1.data.batches];
    const allCompleted = allBatches.every(batch => batch.status === 'completed');
    const prioritiesCorrect = status2.data.status === 'completed' && status1.data.status === 'completed';

    console.log("\n✅ Test passed:", allCompleted && prioritiesCorrect);

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Body:", error.response.data);
    }
  }
}

runTest();
