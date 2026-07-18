import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DUMP_DIR = 'D:\\mongodb_dump\\test';
const BATCH_SIZE = 500; 

const arrayFields = ['OurValues', 'internBenifits', 'subfield', 'subfields', 'skills', 'departments', 'requirements', 'internships'];

function cleanMongoDocument(doc) {
  const cleaned = { ...doc };
  
  // Extract _id
  if (cleaned._id && cleaned._id.$oid) {
    cleaned.id = cleaned._id.$oid;
    delete cleaned._id;
  }
  
  // Clean dates and binaries and empty strings
  for (const key in cleaned) {
    const val = cleaned[key];
    
    // Convert empty strings to null to avoid array literal errors in Supabase
    if (val === "") {
      cleaned[key] = null;
      continue;
    }

    if (val && typeof val === 'object') {
      if (val.$date) {
        cleaned[key] = val.$date;
      } else if (val.data && val.data.$binary) {
        // Strip out massive MongoDB base64 binaries as they bloat PostgreSQL TEXT columns
        // Users will need to re-upload their avatars/CVs
        cleaned[key] = null;
      }
    } else if (typeof val === 'string' && arrayFields.includes(key)) {
      // If an array field is passed as a string, wrap it in an array
      cleaned[key] = [val];
    }
  }
  
  // Remove mongoose version key
  delete cleaned.__v;
  
  return cleaned;
}

async function uploadTable(filename, tableName) {
  const filePath = path.join(DUMP_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} not found. Skipping.`);
    return;
  }
  
  console.log(`\nReading ${filename}...`);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(rawData);
  console.log(`Parsed ${data.length} records for table ${tableName}.`);
  
  const cleanedData = data.map(cleanMongoDocument);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < cleanedData.length; i += BATCH_SIZE) {
    const batch = cleanedData.slice(i, i + BATCH_SIZE);
    process.stdout.write(`Uploading batch ${i} to ${i + batch.length - 1}...\r`);
    
    const { error } = await supabase.from(tableName).upsert(batch, { onConflict: 'id' });
    
    if (error) {
      console.error(`\nError uploading batch for ${tableName} (index ${i}):`, error.message);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
    }
  }
  
  console.log(`\nFinished ${tableName}: ${successCount} inserted/updated, ${errorCount} errors.`);
}

async function main() {
  await uploadTable('adminschemas.json', 'admins');
  await uploadTable('companyschemas.json', 'companies');
  await uploadTable('studentschemas.json', 'students');
  await uploadTable('internshipschemas.json', 'internships');
  await uploadTable('applicationschemas.json', 'applications');
  
  console.log('\nMigration complete.');
}

main().catch(console.error);
