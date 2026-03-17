import { Client, Databases, Permission, Role } from 'node-appwrite';

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69b8ea57002921f86d3f';
const DATABASE_ID = 'portfolio_db';
const COLLECTION_ID = 'messages';

const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Usage: node scripts/create-messages-collection.mjs YOUR_API_KEY');
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
  console.log('Creating "messages" collection...');

  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Messages',
      [
        Permission.create(Role.any()),
        Permission.read(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log('Collection created successfully.');
  } catch (err) {
    if (err.code === 409) {
      console.log('Collection "messages" already exists, continuing with attributes...');
    } else {
      throw err;
    }
  }

  const attributes = [
    { method: 'createStringAttribute', args: [DATABASE_ID, COLLECTION_ID, 'name', 255, true] },
    { method: 'createStringAttribute', args: [DATABASE_ID, COLLECTION_ID, 'email', 255, true] },
    { method: 'createStringAttribute', args: [DATABASE_ID, COLLECTION_ID, 'subject', 255, true] },
    { method: 'createStringAttribute', args: [DATABASE_ID, COLLECTION_ID, 'message', 5000, true] },
    { method: 'createBooleanAttribute', args: [DATABASE_ID, COLLECTION_ID, 'read', false, false] },
    { method: 'createStringAttribute', args: [DATABASE_ID, COLLECTION_ID, 'createdAt', 255, true] },
  ];

  for (const attr of attributes) {
    try {
      console.log(`Creating attribute: ${attr.args[2]}...`);
      await databases[attr.method](...attr.args);
      console.log(`  -> ${attr.args[2]} created.`);
    } catch (err) {
      if (err.code === 409) {
        console.log(`  -> ${attr.args[2]} already exists, skipping.`);
      } else {
        console.error(`  -> Error creating ${attr.args[2]}:`, err.message);
      }
    }
  }

  console.log('');
  console.log('Done! The "messages" collection is ready.');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
