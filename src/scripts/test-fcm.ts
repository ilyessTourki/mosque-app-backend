import { firebaseMessaging } from '../config/firebase.js';

async function main() {
  const messageId = await firebaseMessaging.send({
    topic: 'mosque_test',
    notification: {
      title: 'Backend test successful',
      body: 'This notification was sent by your Node.js API.',
    },
    data: {
      type: 'TEST',
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'default',
      },
    },
  });

  console.log('FCM message sent:', messageId);
}

main().catch((error) => {
  console.error('Unable to send FCM message:', error);
  process.exit(1);
});