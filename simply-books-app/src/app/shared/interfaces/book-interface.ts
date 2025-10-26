export interface BookInterface {
  id : number;
  title: string;
  author: string;
  year?: number;
  portrait_url?: string;
  file_url?: string;
  description?: string;
  rating?: number;
  pages : number;
  pages_read?: number;
  isbn?: string;
  subjects?: string[];
  language?: string;

}
