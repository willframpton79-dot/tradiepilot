#!/usr/bin/env node
/**
 * Expire a user's trial for testing.
 * Usage: node scripts/expire-trial.js user@example.com
 *
 * Reads MONGODB_URI from .env.local or the environment.
 */

const path = require('path');
const fs = require('fs');

// Load .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/expire-trial.js user@example.com');
  process.exit(1);
}

const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Error: MONGODB_URI is not set. Add it to .env.local or export it.');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const before = await users.findOne({ email });
    if (!before) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    console.log('\n--- BEFORE ---');
    console.log('  email:          ', before.email);
    console.log('  tier:           ', before.tier);
    console.log('  trialStartedAt: ', before.trialStartedAt);
    console.log('  trialEndsAt:    ', before.trialEndsAt);

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await users.updateOne(
      { email },
      { $set: { trialEndsAt: yesterday } }
    );

    const after = await users.findOne({ email });

    console.log('\n--- AFTER ---');
    console.log('  email:          ', after.email);
    console.log('  tier:           ', after.tier);
    console.log('  trialStartedAt: ', after.trialStartedAt);
    console.log('  trialEndsAt:    ', after.trialEndsAt);
    console.log('\nTrial expired successfully. trialEndsAt is now 24 hours in the past.');
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
