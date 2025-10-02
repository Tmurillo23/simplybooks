import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_KEY, SUPABASE_URL, SUPABASE_FILES_BUCKET } from '../../../environments/environment';
import { v7 as uuidv7 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class Storage {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  async uploadFile(imagefile:File, username:string) {
    const fileName = uuidv7();
    console.log('Uploading with fileName', fileName)
    return this.supabase.storage
        .from(SUPABASE_FILES_BUCKET)
        .upload(`${username}/${fileName}`, imagefile)
        .then(response=>{
          return response;
        })
        .catch(error=>console.error(error))
  }

  getFileUrl(fullPhat:string){
    return `${SUPABASE_URL}/storage/v1/object/public/${fullPhat}`;
  }
}
