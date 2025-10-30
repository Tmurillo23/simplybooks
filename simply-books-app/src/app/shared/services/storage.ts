import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_KEY, SUPABASE_URL, SUPABASE_FILES_BUCKET } from '../../../environments/environment';
import { v7 as uuidv7 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class Storage {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  async uploadFile(imagefile: File, username: string, bucket: string) {
    const fileName = uuidv7();

    console.log('Uploading with fileName', fileName);
    console.log('Bucket:', bucket);
    console.log('Username:', username);

    try {
      const response = await this.supabase.storage
        .from(bucket)
        .upload(`${username}/${fileName}`, imagefile); // ⚠️ CAMBIO IMPORTANTE AQUÍ

      if (response.data) {
        return response.data.path; // Retorna el path directamente
      }

      throw response.error;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  uploadAvatar(imageFile: File, username: string) {
    return this.uploadFile(imageFile, username, 'avatar');
  }

  getFileUrl(fullPath: string, bucket: string) {
    // Simplifica esto
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fullPath}`;
  }

  async listUserFiles(username: string) {
    try {
      const { data, error } = await this.supabase.storage
        .from(SUPABASE_FILES_BUCKET)
        .list(username);

      if (error) {
        console.error('Error listing files:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error listing user files:', error);
      return [];
    }
  }
}
