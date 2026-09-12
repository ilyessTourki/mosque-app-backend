import { firebaseMessaging } from "../../config/firebase.js";

type NewsPushInput = {
  mosqueId: string;
  newsId: string;
  title: string;
  body?: string | null;
};

class NotificationService {
  async sendNewsPublished(input: NewsPushInput): Promise<void> {
    const title = input.title.trim();
    const body = input.body?.trim() || "A new announcement has been published.";

    await firebaseMessaging.send({
      topic: `mosque_${input.mosqueId}`,
      notification: {
        title,
        body,
      },
      data: {
        type: "NEWS_PUBLISHED",
        mosqueId: input.mosqueId,
        newsId: input.newsId,
      },
      android: {
        priority: "high",
      },
    });
  }
}

export const notificationService = new NotificationService();