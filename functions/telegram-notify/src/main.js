export default async ({ req, res, log, error }) => {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  // Validate environment variables
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables');
    return res.json({ success: false, error: 'Missing configuration' }, 500);
  }

  try {
    // Parse the event payload - Appwrite sends the document data
    let messageData;
    
    if (req.body) {
      // If triggered by event, the body contains the document
      messageData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }

    if (!messageData || !messageData.name) {
      error('No valid message data received');
      return res.json({ success: false, error: 'No message data' }, 400);
    }

    log(`Processing message from: ${messageData.name}`);

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

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      error(`Telegram API error: ${JSON.stringify(telegramResult)}`);
      return res.json({ success: false, error: telegramResult.description }, 500);
    }

    log('Telegram notification sent successfully');
    return res.json({ success: true, message: 'Notification sent' });

  } catch (err) {
    error(`Error sending notification: ${err.message}`);
    return res.json({ success: false, error: err.message }, 500);
  }
};

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
