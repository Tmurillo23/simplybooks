import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BookInterface } from '../interfaces/book-interface';
import { getHeaders } from '../utils/utility';

interface OpenLibrarySearchResponse {
  start: number;
  num_found: number;
  docs: any[];
}

interface BackendBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  cover: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private apiUrl = 'https://openlibrary.org/search.json';
  private coversBaseUrl = 'https://covers.openlibrary.org/b';
  private backendUrl = 'http://localhost:3000/api/v1/books';

  constructor(private http: HttpClient) {}

  // Search books in Open Library
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

  // Get books from backend for a specific user
  getBooksByUser(userId: string): Observable<BookInterface[]> {
    return this.http.get<BackendBook[]>(`${this.backendUrl}/user/${userId}`, getHeaders).pipe(
      map(backendBooks => backendBooks.map(book => this.mapBackendToFrontend(book)))
    );
  }

  // Save book to backend
  saveBookToBackend(book: BookInterface, userId: string): Observable<any> {
    const backendBook = this.mapFrontendToBackend(book, userId);
    return this.http.post(this.backendUrl, backendBook, getHeaders);
  }

  // Update book in backend
  updateBookInBackend(bookId: string, book: BookInterface): Observable<any> {
    const backendBook = this.mapFrontendToBackend(book, book.userId!);
    return this.http.patch(`${this.backendUrl}/${bookId}`, backendBook, getHeaders);
  }

  // Delete book from backend
  deleteBookFromBackend(bookId: string): Observable<any> {
    return this.http.delete(`${this.backendUrl}/${bookId}`, getHeaders);
  }

  // Get book cover URL
  getBookCoverUrl(coverId?: number, isbn?: string[], size: 'S' | 'M' | 'L' = 'M'): string {
    if (coverId) {
      return `${this.coversBaseUrl}/id/${coverId}-${size}.jpg`;
    } else if (isbn && isbn.length > 0) {
      return `${this.coversBaseUrl}/isbn/${isbn[0]}-${size}.jpg`;
    }
    return 'assets/default-cover.jpg';
  }

  // Map Open Library API response to BookInterface
  private mapOpenLibraryToBook(doc: any): BookInterface {
    const authorName = doc.author_name && doc.author_name.length > 0 ? doc.author_name[0] : 'Unknown Author';
    const firstIsbn = doc.isbn && doc.isbn.length > 0 ? doc.isbn[0] : undefined;
    
    return {
      id: this.generateIdFromTitleAndAuthor(doc.title, authorName),
      title: doc.title || 'Unknown Title',
      author: authorName,
      year: doc.first_publish_year || new Date().getFullYear(),
      portrait_url: this.getBookCoverUrl(doc.cover_i, doc.isbn),
      pages: 0, // Default, can be updated
      pages_read: 0,
      reading_status: 'Por leer',
      description: '', // Open Library doesn't provide description in search results
      rating: 0,
      isbn: firstIsbn
    };
  }

  // Map backend book to frontend book interface
  private mapBackendToFrontend(backendBook: BackendBook): BookInterface {
    return {
      id: this.generateIdFromTitleAndAuthor(backendBook.title, backendBook.author),
      title: backendBook.title,
      author: backendBook.author,
      year: 0, // Backend doesn't store year
      portrait_url: backendBook.cover || 'assets/default-cover.jpg',
      pages: 0, // Backend doesn't store pages
      pages_read: 0,
      reading_status: 'Por leer',
      description: '', // Backend doesn't store description
      rating: 0,
      isbn: backendBook.isbn,
      userId: backendBook.userId
    };
  }

  // Map frontend book to backend DTO
  private mapFrontendToBackend(frontendBook: BookInterface, userId: string): any {
    return {
      title: frontendBook.title,
      author: frontendBook.author,
      isbn: frontendBook.isbn || '', // Use ISBN from Open Library if available
      cover: frontendBook.portrait_url, // Map portrait_url to cover
      userId: userId
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