/**
 * Storage Utility Functions
 *
 * Helper functions for managing PDF and image storage in Supabase
 */

import { supabase, BUCKETS, getSignedUrl, getPublicUrl, isSupabaseConfigured } from './supabase';

export interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

export interface DownloadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a PDF file to Supabase storage
 */
export async function uploadPDF(
  file: File,
  path: string
): Promise<UploadResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { data, error } = await supabase.storage
      .from(BUCKETS.PDFS)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const url = getPublicUrl(BUCKETS.PDFS, data.path);

    return {
      success: true,
      path: data.path,
      url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get a download URL for a PDF (signed URL for private access)
 */
export async function getPDFDownloadUrl(
  path: string,
  expiresIn: number = 3600
): Promise<DownloadResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const url = await getSignedUrl(BUCKETS.PDFS, path, expiresIn);

    if (!url) {
      return { success: false, error: 'Failed to generate download URL' };
    }

    return { success: true, url };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a PDF from storage
 */
export async function deletePDF(path: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase.storage.from(BUCKETS.PDFS).remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * List all PDFs in a folder
 */
export async function listPDFs(folder: string = '') {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured', files: [] };
  }

  try {
    const { data, error } = await supabase.storage.from(BUCKETS.PDFS).list(folder);

    if (error) {
      return { success: false, error: error.message, files: [] };
    }

    return { success: true, files: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      files: [],
    };
  }
}

/**
 * Check if a PDF exists in storage
 */
export async function pdfExists(path: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { data, error } = await supabase.storage.from(BUCKETS.PDFS).list(path);

    return !error && data && data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get PDF metadata
 */
export async function getPDFMetadata(path: string) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { data, error } = await supabase.storage.from(BUCKETS.PDFS).list(path);

    if (error || !data || data.length === 0) {
      return { success: false, error: 'PDF not found' };
    }

    return { success: true, metadata: data[0] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
