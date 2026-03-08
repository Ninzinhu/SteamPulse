import webpush from "web-push";
import { config } from "../config";

export const initPush = () => {
  if (config.vapidPublicKey && config.vapidPrivateKey) {
    webpush.setVapidDetails(
      "mailto:no-reply@steampulse.local",
      config.vapidPublicKey,
      config.vapidPrivateKey,
    );
  }
};

export const sendPush = async (subscription: any, payload: any) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    console.error("push send error", err);
  }
};
