#!/usr/bin/env node
/**
 * Print key fields for a user record.
 * Usage: node scripts/check-user.js user@example.com
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
  console.error('Usage: node scripts/check-user.js user@example.com');
  process.exit(1);
}

const { MongoClient } = require('mongodb');

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

    const user = await users.findOne({ email });
    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    const now = new Date();
    const endsAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;
    const daysRemaining = endsAt
      ? Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    console.log('\n--- USER RECORD ---');
    console.log('  _id:              ', user._id.toString());
    console.log('  email:            ', user.email);
    console.log('  name:             ', user.name);
    console.log('  tier:             ', user.tier);
    console.log('  trialStartedAt:   ', user.trialStartedAt ?? '(not set)');
    console.log('  trialEndsAt:      ', user.trialEndsAt ?? '(not set)');
    console.log('  trialStatus:      ',
      daysRemaining === null ? 'no trial date set' :
      daysRemaining <= 0 ? `EXPIRED (${Math.abs(daysRemaining)}d ago)` :
      `active (${daysRemaining}d remaining)`
    );
    console.log('  stripeCustomerId: ', user.stripeCustomerId || '(not set)');
    console.log('  onboardingComplete:', user.onboardingComplete);
    console.log('  createdAt:        ', user.createdAt ?? '(no timestamp)');
    console.log('-------------------\n');
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
