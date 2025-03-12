import cron from "node-cron";
import axios from "axios";

const SERVER_URL = process.env.SERVER_URL;

if (!SERVER_URL) {
  throw new Error("SERVER_URL environment variable is not set");
}

const startCronJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      await axios.get(SERVER_URL);
    } catch (error) {
      console.error(" Error pinging server:", error);
    }
  });
};

export default startCronJob;
