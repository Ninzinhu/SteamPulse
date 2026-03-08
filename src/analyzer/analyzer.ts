import { createWorker } from "../jobs/queue";

export const startAnalyzer = () => {
  const worker = createWorker("analyze", async (job) => {
    const { snapshotId } = job.data;
    console.log("analyzing snapshot", snapshotId);
    // TODO: compare price with user acquisition and create alerts
  });

  worker.on("failed", (job, err) => {
    console.error("analyzer job failed", job.id, err);
  });
};
