import { supabaseAdmin } from './supabase';

/**
 * Supabase Storage Integration
 * Handles file uploads to Supabase Storage buckets
 */

export interface UploadOptions {
  bucket: string;
  path: string;
  file: Buffer | File;
  contentType?: string;
  upsert?: boolean;
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(options: UploadOptions) {
  const { bucket, path, file, contentType, upsert = false } = options;

  const fileBuffer = file instanceof File 
    ? Buffer.from(await file.arrayBuffer())
    : file;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType,
      upsert,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return data;
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Get signed URL for a file (temporary access)
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }

  return true;
}

/**
 * List files in a bucket
 */
export async function listFiles(bucket: string, path?: string) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .list(path);

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data;
}



