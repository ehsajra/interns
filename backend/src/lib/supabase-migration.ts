/**
 * Supabase Migration Helper
 * 
 * This file provides utilities to help migrate from custom auth to Supabase Auth
 * and verify the Supabase connection.
 */

import { supabaseAdmin } from './supabase';

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.from('User').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('✓ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return false;
  }
}

/**
 * Verify storage buckets exist
 */
export async function verifyStorageBuckets(): Promise<{ resumes: boolean; certificates: boolean }> {
  const buckets = ['resumes', 'certificates'];
  const results: { resumes: boolean; certificates: boolean } = {
    resumes: false,
    certificates: false,
  };

  for (const bucket of buckets) {
    try {
      const { data, error } = await supabaseAdmin.storage.from(bucket).list('', {
        limit: 1,
      });

      if (!error) {
        results[bucket as keyof typeof results] = true;
        console.log(`✓ Storage bucket '${bucket}' exists`);
      } else {
        console.error(`✗ Storage bucket '${bucket}' not found:`, error.message);
      }
    } catch (error) {
      console.error(`✗ Error checking bucket '${bucket}':`, error);
    }
  }

  return results;
}

/**
 * Run all migration checks
 */
export async function runMigrationChecks() {
  console.log('Running migration checks...\n');

  const dbConnected = await testSupabaseConnection();
  const storageBuckets = await verifyStorageBuckets();

  console.log('\n=== Migration Status ===');
  console.log(`Database: ${dbConnected ? '✓ Connected' : '✗ Not connected'}`);
  console.log(`Storage (resumes): ${storageBuckets.resumes ? '✓ Ready' : '✗ Not found'}`);
  console.log(`Storage (certificates): ${storageBuckets.certificates ? '✓ Ready' : '✗ Not found'}`);

  return {
    database: dbConnected,
    storage: storageBuckets,
    allReady: dbConnected && storageBuckets.resumes && storageBuckets.certificates,
  };
}



