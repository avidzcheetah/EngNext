import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Connection details provided by user
const SUPABASE_URL = 'https://gkuwoizewqaqdfuzlmro.supabase.co';
const SUPABASE_KEY = 'sb_publishable_F5N4o-uBqEngkd-oH0OZSg_1ns82wCO';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function parseMongoTypes(obj) {
  if (Array.isArray(obj)) {
    return obj.map(parseMongoTypes);
  } else if (obj !== null && typeof obj === 'object') {
    if (obj.$oid) return obj.$oid;
    if (obj.$date) return obj.$date;
    if (obj.$numberInt) return parseInt(obj.$numberInt, 10);
    if (obj.$numberDouble) return parseFloat(obj.$numberDouble);
    
    const newObj = {};
    for (const key in obj) {
      if (key === '_id') {
        newObj.id = parseMongoTypes(obj[key]);
      } else {
        newObj[key] = parseMongoTypes(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

async function migrateCollection(filePath, tableName) {
  console.log(`Migrating ${filePath} to ${tableName}...`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} not found. Skipping.`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const parsedData = data.map(parseMongoTypes).map(item => {
    delete item.__v;
    return item;
  });
  
  // Batch insert
  const batchSize = 100;
  for (let i = 0; i < parsedData.length; i += batchSize) {
    const batch = parsedData.slice(i, i + batchSize);
    const { error } = await supabase.from(tableName).upsert(batch);
    if (error) {
      console.error(`Error inserting into ${tableName}:`, error);
    } else {
      console.log(`Inserted ${i + batch.length} / ${parsedData.length} records into ${tableName}`);
    }
  }
}

async function run() {
  await migrateCollection('D:/mongodb_dump/test/studentschemas.json', 'students');
  await migrateCollection('D:/mongodb_dump/test/companyschemas.json', 'companies');
  await migrateCollection('D:/mongodb_dump/test/internshipschemas.json', 'internships');
  await migrateCollection('D:/mongodb_dump/test/applicationschemas.json', 'applications');
  await migrateCollection('D:/mongodb_dump/test/adminschemas.json', 'admins');
  console.log("Migration script finished (note: ensure SQL schema is created first).");
}

run();
