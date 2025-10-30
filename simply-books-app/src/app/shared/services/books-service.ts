import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BookInterface } from '../interfaces/book-interface';

interface OpenLibrarySearchResponse {
  start: number;
  num_found: number;
  docs: any[];
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private apiUrl = 'https://openlibrary.org/search.json';
  private coversBaseUrl = 'https://covers.openlibrary.org/b';

  constructor(private http: HttpClient) {}

  // Search books by query
  searchBooks(query: string, limit: number = 20, page: number = 1): Observable<{books: BookInterface[], total: number}> {
    let params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString())
      .set('page', page.toString())
      .set('fields', 'title,author_name,first_publish_year,cover_i,isbn');

    return this.http.get<OpenLibrarySearchResponse>(this.apiUrl, { params }).pipe(
      map(response => ({
        books: response.docs.map(doc => this.mapOpenLibraryToBook(doc)),
        total: response.num_found
      }))
    );
  }

  // Search by title
  searchBooksByTitle(title: string, limit: number = 20): Observable<{books: BookInterface[], total: number}> {
    let params = new HttpParams()
      .set('title', title)
      .set('limit', limit.toString())
      .set('fields', 'title,author_name,first_publish_year,cover_i,isbn');

    return this.http.get<OpenLibrarySearchResponse>(this.apiUrl, { params }).pipe(
      map(response => ({
        books: response.docs.map(doc => this.mapOpenLibraryToBook(doc)),
        total: response.num_found
      }))
    );
  }

  // Search by author
  searchBooksByAuthor(author: string, limit: number = 20): Observable<{books: BookInterface[], total: number}> {
    let params = new HttpParams()
      .set('author', author)
      .set('limit', limit.toString())
      .set('fields', 'title,author_name,first_publish_year,cover_i,isbn');

    return this.http.get<OpenLibrarySearchResponse>(this.apiUrl, { params }).pipe(
      map(response => ({
        books: response.docs.map(doc => this.mapOpenLibraryToBook(doc)),
        total: response.num_found
      }))
    );
  }

  // Get book cover URL
  getBookCoverUrl(coverId?: number, isbn?: string[], size: 'S' | 'M' | 'L' = 'M'): string {
    if (coverId) {
      return `${this.coversBaseUrl}/id/${coverId}-${size}.jpg`;
    } else if (isbn && isbn.length > 0) {
      return `${this.coversBaseUrl}/isbn/${isbn[0]}-${size}.jpg`;
    }
    
    // Return placeholder if no cover available
    return 'assets/book-placeholder.png';
  }

  // Map Open Library API response to BookInterface
  private mapOpenLibraryToBook(doc: any): BookInterface {
    const authorName = doc.author_name && doc.author_name.length > 0 ? doc.author_name[0] : 'Unknown Author';
    
    return {
      id: this.generateIdFromTitleAndAuthor(doc.title, authorName),
      title: doc.title || 'Unknown Title',
      author: authorName,
      year: doc.first_publish_year || new Date().getFullYear(),
      portrait_url: this.getBookCoverUrl(doc.cover_i, doc.isbn),
      pages: 0, // Default value, can be updated later
      reading_status: 'Por leer'
    };
  }

  // Generate stable ID from title and author
  private generateIdFromTitleAndAuthor(title: string, author: string): number {
    const combined = title + author;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
}