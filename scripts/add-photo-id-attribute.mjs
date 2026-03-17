/**
 * Add the "photo_id" attribute to the personal_info collection.
 *
 * Usage:
 *   node scripts/add-photo-id-attribute.mjs YOUR_API_KEY
 *
 * Get an API key from: Appwrite Console > Project Settings > API Keys
 * The key needs permissions: databases.read, databases.write, collections.read, collections.write
 */

import { Client, Databases } from 'node-appwrite';

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69b8ea57002921f86d3f';
const DATABASE_ID = 'portfolio_db';
const COLLECTION_ID = 'personal_info';

const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Usage: node scripts/add-photo-id-attribute.mjs YOUR_API_KEY');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(apiKey);

const databases = new Databases(client);

async function main() {
  try {
    console.log('Adding photo_id attribute to personal_info collection...');

    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'photo_id',
      255,       // max length
      false,     // required
      '',        // default
      false      // array
    );

    console.log('photo_id attribute created successfully!');
    console.log('Note: The attribute may take a few seconds to become available.');
    console.log('You can now upload a profile photo from the admin dashboard.');
  } catch (error) {
    if (error.message?.includes('already exists') || error.code === 409) {
      console.log('photo_id attribute already exists - no action needed.');
    } else {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }
}

main();
