import { Client, Databases, ID, Query } from 'node-appwrite';

const DATABASE_ID = 'portfolio_db';
const SUBSCRIBERS_COLLECTION = 'telegram_subscribers';

// User states for conversation flow
const userStates = new Map();

export default async ({ req, res, log, error }) => {
  const { 
    TELEGRAM_BOT_TOKEN, 
    SUBSCRIPTION_PASSWORD,
    APPWRITE_FUNCTION_API_KEY,
    APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1',
    APPWRITE_PROJECT_ID = '69b8ea57002921f86d3f'
  } = process.env;

  // Validate environment variables
  if (!TELEGRAM_BOT_TOKEN || !SUBSCRIPTION_PASSWORD) {
    error('Missing TELEGRAM_BOT_TOKEN or SUBSCRIPTION_PASSWORD');
    return res.json({ success: false, error: 'Missing configuration' }, 500);
  }

  try {
    // Parse Telegram update
    let update;
    if (typeof req.body === 'string') {
      update = JSON.parse(req.body);
    } else {
      update = req.body;
    }

    const message = update.message;
    if (!message) {
      return res.json({ success: true, message: 'No message in update' });
    }

    const chatId = message.chat.id.toString();
    const text = message.text || '';
    const username = message.from?.username || '';
    const firstName = message.from?.first_name || '';

    log(`Received message from ${chatId}: ${text}`);

    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_FUNCTION_API_KEY);

    const databases = new Databases(client);

    // Handle commands
    if (text === '/start') {
      // Check if already subscribed
      const existing = await databases.listDocuments(
        DATABASE_ID,
        SUBSCRIBERS_COLLECTION,
        [Query.equal('chat_id', chatId)]
      );

      if (existing.documents.length > 0 && existing.documents[0].active) {
        await sendTelegramMessage(chatId, 
          'You are already subscribed to notifications.\n\nUse /stop to unsubscribe.',
          TELEGRAM_BOT_TOKEN
        );
      } else {
        // Ask for password
        userStates.set(chatId, 'awaiting_password');
        await sendTelegramMessage(chatId,
          'Welcome! To subscribe to consultation notifications, please enter the password:',
          TELEGRAM_BOT_TOKEN
        );
      }
      return res.json({ success: true });
    }

    if (text === '/stop') {
      // Unsubscribe user
      const existing = await databases.listDocuments(
        DATABASE_ID,
        SUBSCRIBERS_COLLECTION,
        [Query.equal('chat_id', chatId)]
      );

      if (existing.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          SUBSCRIBERS_COLLECTION,
          existing.documents[0].$id,
          { active: false }
        );
        await sendTelegramMessage(chatId,
          'You have been unsubscribed. You will no longer receive notifications.\n\nUse /start to subscribe again.',
          TELEGRAM_BOT_TOKEN
        );
      } else {
        await sendTelegramMessage(chatId,
          'You are not subscribed.\n\nUse /start to subscribe.',
          TELEGRAM_BOT_TOKEN
        );
      }
      return res.json({ success: true });
    }

    if (text === '/status') {
      // Check subscription status
      const existing = await databases.listDocuments(
        DATABASE_ID,
        SUBSCRIBERS_COLLECTION,
        [Query.equal('chat_id', chatId)]
      );

      if (existing.documents.length > 0 && existing.documents[0].active) {
        await sendTelegramMessage(chatId,
          'Status: SUBSCRIBED\n\nYou will receive notifications for new consultations.\n\nUse /stop to unsubscribe.',
          TELEGRAM_BOT_TOKEN
        );
      } else {
        await sendTelegramMessage(chatId,
          'Status: NOT SUBSCRIBED\n\nUse /start to subscribe.',
          TELEGRAM_BOT_TOKEN
        );
      }
      return res.json({ success: true });
    }

    // Check if user is in password entry state
    // Since we can't persist state across function calls, check if user exists but inactive
    const existing = await databases.listDocuments(
      DATABASE_ID,
      SUBSCRIBERS_COLLECTION,
      [Query.equal('chat_id', chatId)]
    );

    const isAwaitingPassword = existing.documents.length === 0 || !existing.documents[0].active;

    if (isAwaitingPassword) {
      // Verify password
      if (text === SUBSCRIPTION_PASSWORD) {
        // Password correct - subscribe user
        if (existing.documents.length > 0) {
          // Reactivate existing subscription
          await databases.updateDocument(
            DATABASE_ID,
            SUBSCRIBERS_COLLECTION,
            existing.documents[0].$id,
            { 
              active: true,
              subscribed_at: new Date().toISOString()
            }
          );
        } else {
          // Create new subscription
          await databases.createDocument(
            DATABASE_ID,
            SUBSCRIBERS_COLLECTION,
            ID.unique(),
            {
              chat_id: chatId,
              username: username,
              first_name: firstName,
              active: true,
              subscribed_at: new Date().toISOString()
            }
          );
        }

        await sendTelegramMessage(chatId,
          'Subscribed successfully!\n\nYou will now receive notifications for new consultation requests.\n\nCommands:\n/status - Check subscription status\n/stop - Unsubscribe',
          TELEGRAM_BOT_TOKEN
        );
        log(`User ${chatId} subscribed successfully`);
      } else {
        // Wrong password
        await sendTelegramMessage(chatId,
          'Incorrect password. Please try again.\n\nUse /start to restart.',
          TELEGRAM_BOT_TOKEN
        );
        log(`User ${chatId} entered wrong password`);
      }
      return res.json({ success: true });
    }

    // Default response for subscribed users
    await sendTelegramMessage(chatId,
      'You are subscribed to notifications.\n\nCommands:\n/status - Check subscription status\n/stop - Unsubscribe',
      TELEGRAM_BOT_TOKEN
    );

    return res.json({ success: true });

  } catch (err) {
    error(`Error processing update: ${err.message}`);
    return res.json({ success: false, error: err.message }, 500);
  }
};

async function sendTelegramMessage(chatId, text, botToken) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    }
  );
  return response.json();
}
