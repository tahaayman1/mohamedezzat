// Script to set up Telegram webhook for the bot function
// Usage: node scripts/setup-telegram-webhook.mjs <FUNCTION_DOMAIN>

const TELEGRAM_BOT_TOKEN = '8779709542:AAHRLQTJkSWYh4GeY3TFiYZ5nFqPbvbhXf0';

const functionDomain = process.argv[2];

if (!functionDomain) {
  console.log('='.repeat(60));
  console.log('TELEGRAM WEBHOOK SETUP');
  console.log('='.repeat(60));
  console.log('');
  console.log('To set up the webhook, you need the Function URL from Appwrite.');
  console.log('');
  console.log('Steps:');
  console.log('1. Go to Appwrite Console > Functions > telegram-bot');
  console.log('2. Copy the "Domain" URL (looks like: 67xxxxxx.appwrite.global)');
  console.log('3. Run this script with the domain:');
  console.log('');
  console.log('   node scripts/setup-telegram-webhook.mjs YOUR_FUNCTION_DOMAIN');
  console.log('');
  console.log('Example:');
  console.log('   node scripts/setup-telegram-webhook.mjs 67abc123.appwrite.global');
  console.log('');
  console.log('='.repeat(60));
  console.log('');
  console.log('MANUAL SETUP (Alternative):');
  console.log('');
  console.log('Open this URL in your browser (replace FUNCTION_URL):');
  console.log('');
  console.log(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=https://FUNCTION_URL`);
  console.log('');
  console.log('='.repeat(60));
  process.exit(0);
}

async function setupWebhook() {
  const webhookUrl = functionDomain.startsWith('http') 
    ? functionDomain 
    : `https://${functionDomain}`;

  console.log('Setting up Telegram webhook...');
  console.log(`Webhook URL: ${webhookUrl}`);
  console.log('');

  try {
    // Set webhook
    const setResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message'],
        }),
      }
    );

    const setResult = await setResponse.json();
    
    if (setResult.ok) {
      console.log('✅ Webhook set successfully!');
    } else {
      console.error('❌ Failed to set webhook:', setResult.description);
      process.exit(1);
    }

    // Get webhook info
    const infoResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`
    );
    const infoResult = await infoResponse.json();

    console.log('');
    console.log('Webhook Info:');
    console.log(`  URL: ${infoResult.result.url}`);
    console.log(`  Pending updates: ${infoResult.result.pending_update_count}`);
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ Setup complete! The bot is now ready to receive messages.');
    console.log('='.repeat(60));

  } catch (err) {
    console.error('Error setting up webhook:', err.message);
    process.exit(1);
  }
}

setupWebhook();
