import { Client, Databases, Query } from 'node-appwrite';

const DATABASE_ID = 'portfolio_db';
const SUBSCRIBERS_COLLECTION = 'telegram_subscribers';

export default async ({ req, res, log, error }) => {
  const { 
    TELEGRAM_BOT_TOKEN,
    APPWRITE_FUNCTION_API_KEY,
    APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1',
    APPWRITE_PROJECT_ID = '69b8ea57002921f86d3f'
  } = process.env;

  // Validate environment variables
  if (!TELEGRAM_BOT_TOKEN) {
    error('Missing TELEGRAM_BOT_TOKEN environment variable');
    return res.json({ success: false, error: 'Missing configuration' }, 500);
  }

  try {
    // Parse the event payload - Appwrite sends the document data
    let messageData;
    
    if (req.body) {
      messageData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }

    if (!messageData || !messageData.name) {
      error('No valid message data received');
      return res.json({ success: false, error: 'No message data' }, 400);
    }

    log(`Processing message from: ${messageData.name}`);

    // Initialize Appwrite client to fetch subscribers
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_FUNCTION_API_KEY);

    const databases = new Databases(client);

    // Fetch all active subscribers
    const subscribers = await databases.listDocuments(
      DATABASE_ID,
      SUBSCRIBERS_COLLECTION,
      [Query.equal('active', true)]
    );

    if (subscribers.documents.length === 0) {
      log('No active subscribers found');
      return res.json({ success: true, message: 'No subscribers to notify' });
    }

    log(`Found ${subscribers.documents.length} active subscribers`);

    // Format the Telegram message - Professional Arabic style
    const text = 
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*طلب استشارة جديد*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*الاسم:* ${escapeMarkdown(messageData.name)}
*البريد الإلكتروني:* ${escapeMarkdown(messageData.email)}
*الموضوع:* ${escapeMarkdown(messageData.subject)}

*الرسالة:*
${escapeMarkdown(messageData.message)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تم الاستلام: ${formatDate(messageData.createdAt)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    // Send to all active subscribers
    const results = await Promise.allSettled(
      subscribers.documents.map(subscriber => 
        sendTelegramMessage(subscriber.chat_id, text, TELEGRAM_BOT_TOKEN)
      )
    );

    // Count successes and failures
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    log(`Notifications sent: ${successful} successful, ${failed} failed`);

    return res.json({ 
      success: true, 
      message: `Notified ${successful} subscribers`,
      stats: { successful, failed }
    });

  } catch (err) {
    error(`Error sending notifications: ${err.message}`);
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
        text,
        parse_mode: 'Markdown',
      }),
    }
  );
  
  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.description || 'Failed to send message');
  }
  return result;
}

// Escape special Markdown characters to prevent formatting issues
function escapeMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/`/g, '\\`');
}

// Format date in a readable way
function formatDate(dateString) {
  if (!dateString) return new Date().toLocaleString('en-GB');
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return dateString;
  }
}
