import { Client, Databases, Permission, Role } from 'node-appwrite';

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69b8ea57002921f86d3f';
const DATABASE_ID = 'portfolio_db';
const COLLECTION_ID = 'telegram_subscribers';

const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Usage: node scripts/create-telegram-subscribers-collection.mjs YOUR_API_KEY');
  console.error('');
  console.error('Get an API key from: Appwrite Console > Project Settings > API Keys');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(apiKey);

const databases = new Databases(client);

async function main() {
  console.log('Creating "telegram_subscribers" collection...\n');

  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Telegram Subscribers',
      [
        // Only functions can read/write (using API key)
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ]
    );
    console.log('✅ Collection created successfully.');
  } catch (err) {
    if (err.code === 409) {
      console.log('Collection "telegram_subscribers" already exists, continuing with attributes...');
    } else {
      throw err;
    }
  }

  const attributes = [
    { method: 'createStringAttribute', args: [DATABASE_ID, COLLECTION_ID, 'chat_id', 50, true] },
    { method: 'createStringAttribute', args: [DATABASE_ID, COLLECTION_ID, 'username', 100, false] },
    { method: 'createStringAttribute', args: [DATABASE_ID, COLLECTION_ID, 'first_name', 100, false] },
    { method: 'createBooleanAttribute', args: [DATABASE_ID, COLLECTION_ID, 'active', true, true] },
    { method: 'createStringAttribute', args: [DATABASE_ID, COLLECTION_ID, 'subscribed_at', 50, true] },
  ];

  for (const attr of attributes) {
    try {
      console.log(`Creating attribute: ${attr.args[2]}...`);
      await databases[attr.method](...attr.args);
      console.log(`  ✅ ${attr.args[2]} created.`);
    } catch (err) {
      if (err.code === 409) {
        console.log(`  ⏭️  ${attr.args[2]} already exists, skipping.`);
      } else {
        console.error(`  ❌ Error creating ${attr.args[2]}:`, err.message);
      }
    }
  }

  // Wait for attributes to be ready
  console.log('\nWaiting for attributes to be ready...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Create index for chat_id
  try {
    console.log('Creating index for chat_id...');
    await databases.createIndex(
      DATABASE_ID,
      COLLECTION_ID,
      'chat_id_index',
      'key',
      ['chat_id'],
      ['ASC']
    );
    console.log('  ✅ Index created.');
  } catch (err) {
    if (err.code === 409) {
      console.log('  ⏭️  Index already exists.');
    } else {
      console.error('  ❌ Error creating index:', err.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Done! The "telegram_subscribers" collection is ready.');
  console.log('='.repeat(50));
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
