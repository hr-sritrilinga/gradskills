import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and Anon Key
// Found in: Project Settings -> API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gemzxhbyyuhekysnoizv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbXp4aGJ5eXVoZWt5c25vaXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMTExMTcsImV4cCI6MjA5ODU4NzExN30.a8s87A0yOSIOB9fhr3rBoMMd5Ktfh6Jfx2Kdmm9rEsI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to upload a resume to Supabase Storage
 * @param file The file object from input
 * @param bucket The storage bucket name (default: 'resumes')
 */
export async function uploadToSupabase(file: File, bucket: string = 'resumes'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}
