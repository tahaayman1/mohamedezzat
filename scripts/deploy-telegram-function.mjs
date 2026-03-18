import { Client, Functions, Databases } from 'node-appwrite';

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69b8ea57002921f86d3f';
const DATABASE_ID = 'portfolio_db';
const COLLECTION_ID = 'messages';

// Telegram credentials
const TELEGRAM_BOT_TOKEN = '8779709542:AAHRLQTJkSWYh4GeY3TFiYZ5nFqPbvbhXf0';
const TELEGRAM_CHAT_ID = '8068096286';

const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Usage: node scripts/deploy-telegram-function.mjs YOUR_API_KEY');
  console.error('');
  console.error('Get an API key from: Appwrite Console > Project Settings > API Keys');
  console.error('Required scopes: functions.read, functions.write');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(apiKey);

const functions = new Functions(client);

const FUNCTION_ID = 'telegram-notify';
const FUNCTION_NAME = 'Telegram Notify';

async function main() {
  console.log('🚀 Deploying Telegram Notification Function...\n');

  // Step 1: Create or update the function
  let functionExists = false;
  
  try {
    await functions.get(FUNCTION_ID);
    functionExists = true;
    console.log('✅ Function already exists, updating...');
  } catch (err) {
    if (err.code === 404) {
      console.log('📦 Creating new function...');
    } else {
      throw err;
    }
  }

  try {
    if (functionExists) {
      // Update existing function
      await functions.update(
        FUNCTION_ID,
        FUNCTION_NAME,
        undefined, // runtime - can't change
        [`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents.*.create`], // events
        undefined, // schedule
        undefined, // timeout
        undefined, // enabled
        undefined, // logging
        undefined, // entrypoint
        undefined, // commands
        undefined, // scopes
        undefined, // installationId
        undefined, // providerRepositoryId
        undefined, // providerBranch
        undefined, // providerSilentMode
        undefined  // providerRootDirectory
      );
      console.log('✅ Function updated with event trigger');
    } else {
      // Create new function
      await functions.create(
        FUNCTION_ID,
        FUNCTION_NAME,
        'node-18.0', // runtime
        [`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents.*.create`], // events
        undefined, // schedule
        30, // timeout in seconds
        true, // enabled
        true, // logging
        'src/main.js' // entrypoint
      );
      console.log('✅ Function created successfully');
    }
  } catch (err) {
    console.error('❌ Error creating/updating function:', err.message);
    console.error('');
    console.error('Please create the function manually in Appwrite Console:');
    console.error('1. Go to Functions in your Appwrite Console');
    console.error('2. Create a new function with ID: telegram-notify');
    console.error('3. Runtime: Node.js 18.0');
    console.error('4. Entrypoint: src/main.js');
    console.error(`5. Events: databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents.*.create`);
    console.error('');
    // Continue to try setting variables anyway
  }

  // Step 2: Set environment variables
  console.log('\n🔐 Setting environment variables...');
  
  try {
    // Try to update or create variables
    const variables = [
      { key: 'TELEGRAM_BOT_TOKEN', value: TELEGRAM_BOT_TOKEN },
      { key: 'TELEGRAM_CHAT_ID', value: TELEGRAM_CHAT_ID },
    ];

    for (const variable of variables) {
      try {
        await functions.createVariable(FUNCTION_ID, variable.key, variable.value);
        console.log(`  ✅ ${variable.key} set`);
      } catch (err) {
        if (err.code === 409) {
          // Variable exists, update it
          await functions.updateVariable(FUNCTION_ID, variable.key, variable.key, variable.value);
          console.log(`  ✅ ${variable.key} updated`);
        } else {
          throw err;
        }
      }
    }
  } catch (err) {
    console.error('❌ Error setting variables:', err.message);
    console.error('');
    console.error('Please set these variables manually in Appwrite Console:');
    console.error(`  TELEGRAM_BOT_TOKEN = ${TELEGRAM_BOT_TOKEN}`);
    console.error(`  TELEGRAM_CHAT_ID = ${TELEGRAM_CHAT_ID}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 MANUAL STEPS REQUIRED:');
  console.log('='.repeat(60));
  console.log('');
  console.log('1. Go to Appwrite Console > Functions');
  console.log('2. Find "telegram-notify" function (or create it if not exists)');
  console.log('3. Deploy the code:');
  console.log('   - Click on the function');
  console.log('   - Go to "Deployments" tab');
  console.log('   - Click "Create Deployment"');
  console.log('   - Upload the functions/telegram-notify folder as a tarball');
  console.log('   - Or use: tar -czvf telegram-notify.tar.gz -C functions/telegram-notify .');
  console.log('');
  console.log('4. Verify Settings:');
  console.log('   - Runtime: Node.js 18.0');
  console.log('   - Entrypoint: src/main.js');
  console.log(`   - Events: databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents.*.create`);
  console.log('');
  console.log('5. Environment Variables (in Settings tab):');
  console.log(`   - TELEGRAM_BOT_TOKEN = ${TELEGRAM_BOT_TOKEN}`);
  console.log(`   - TELEGRAM_CHAT_ID = ${TELEGRAM_CHAT_ID}`);
  console.log('');
  console.log('='.repeat(60));
  console.log('✨ Done! Test by sending a message through your portfolio.');
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
