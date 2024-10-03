import { Injectable, Logger } from '@nestjs/common';

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { Messaging, getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseMessagingService {
  private readonly fcm: Messaging;
  private readonly logger = new Logger(FirebaseMessagingService.name);

  constructor() {
    const firebaseApp = initializeApp({ credential: applicationDefault() });
    this.fcm = getMessaging(firebaseApp);
  }

  async sendWithToken(details: {
    token: string;
    title: string;
    body: string;
    image?: string;
    data?: Record<string, string | undefined>;
  }) {
    const { token, title, body, image, data } = details;

    Object.keys(data).forEach((key) => data[key] ?? delete data[key]);

    try {
      const messageId = await this.fcm.send({
        token,
        notification: { title, body },
        webpush: { notification: { icon: image } },
      });

      return messageId;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
