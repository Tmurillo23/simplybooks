export interface BookInterface {
  // Frontend-specific fields (not in backend)
  id: number; // Frontend uses number, backend uses UUID string
  year: number;
  description: string;
  rating: number;
  pages_read: number;
  reading_status: string;
  portrait_url: string;
  file_url?: string;

  // Backend-compatible fields
  title: string;
  author: string;
  pages: number;
  
  // Optional backend fields that we'll map
  isbn?: string;
  cover?: string;
  userId?: string;
}
