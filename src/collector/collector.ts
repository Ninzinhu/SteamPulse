import { createWorker } from "../jobs/queue";

// simple placeholder processor
export const startCollector = () => {
  const worker = createWorker("collect", async (job) => {
    const { appId } = job.data;
    console.log("collecting price for", appId);
    // TODO: implement puppeteer scraping and store snapshot
  });

  worker.on("failed", (job, err) => {
    console.error("collector job failed", job.id, err);
  });
};
