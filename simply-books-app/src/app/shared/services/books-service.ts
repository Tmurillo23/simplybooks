import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { BookInterface } from '../interfaces/book-interface';
import { getHeaders } from '../utils/utility';
import { v4 as uuidv4 } from 'uuid';

interface OpenLibrarySearchResponse {
  start: number;
  num_found: number;
  docs: any[];
}

interface BackendBook {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  cover?: string;
  description?: string;
  rating?: number;
  pages?: number;
  pages_read?: number;
  reading_status?: string;
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

  /** 🔍 Buscar libros en Open Library */
  searchBooks(query: string, limit: number = 20, page: number = 1): Observable<{ books: BookInterface[]; total: number }> {
    const params = new HttpParams()
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

  /** 📥 Obtener libros desde backend por usuario */
  getBooksByUser(userId: string): Observable<BookInterface[]> {
    return this.http.get<BackendBook[]>(`${this.backendUrl}/user/${userId}`, getHeaders).pipe(
      map(backendBooks => backendBooks.map(book => this.mapBackendToFrontend(book))),
      catchError(err => {
        console.error('❌ Error cargando libros del backend:', err);
        return of([]);
      })
    );
  }

  saveBookToBackend(book: BookInterface, userId: string): Observable<any> {
    const backendBook = this.mapFrontendToBackend(book, userId);
    console.log('📤 Enviando libro al backend (sin ID):', backendBook);

    return this.http.post(this.backendUrl, backendBook, getHeaders).pipe(
      catchError(err => {
        console.error('❌ Error guardando libro en backend:', err);
        return of(null);
      })
    );
  }

  /** ✏️ Actualizar libro en backend */
  updateBookInBackend(bookId: string, book: BookInterface): Observable<any> {
    const backendBook = this.mapFrontendToBackend(book, book.userId!);
    return this.http.patch(`${this.backendUrl}/${bookId}`, backendBook, getHeaders).pipe(
      catchError(err => {
        console.error('❌ Error actualizando libro en backend:', err);
        return of(null);
      })
    );
  }

  /** 🗑️ Eliminar libro del backend */
  deleteBookFromBackend(bookId: string): Observable<any> {
    return this.http.delete(`${this.backendUrl}/${bookId}`, getHeaders);
  }

  /** 🖼️ Obtener portada del libro */
  getBookCoverUrl(coverId?: number, isbn?: string[], size: 'S' | 'M' | 'L' = 'M'): string {
    if (coverId) {
      return `${this.coversBaseUrl}/id/${coverId}-${size}.jpg`;
    } else if (isbn && isbn.length > 0) {
      return `${this.coversBaseUrl}/isbn/${isbn[0]}-${size}.jpg`;
    }
    return 'assets/default-cover.jpg';
  }

  // 🔄 Mapeos
  /** 🧩 Open Library → Frontend */
  private mapOpenLibraryToBook(doc: any): BookInterface {
    const authorName = doc.author_name?.[0] ?? 'Autor desconocido';
    const firstIsbn = doc.isbn?.[0] ?? undefined;

    return {
      id: uuidv4(),
      title: doc.title ?? 'Título desconocido',
      author: authorName,
      year: doc.first_publish_year ?? new Date().getFullYear(),
      portrait_url: this.getBookCoverUrl(doc.cover_i, doc.isbn),
      pages: 0,
      pages_read: 0,
      reading_status: 'Por leer',
      description: '',
      rating: 0,
      isbn: firstIsbn
    };
  }

  private mapBackendToFrontend(backendBook: BackendBook): BookInterface {
    return {
      id: backendBook.id,
      title: backendBook.title,
      author: backendBook.author,
      year: 0,
      portrait_url: backendBook.cover ?? 'assets/default-cover.jpg',
      description: backendBook.description ?? '',
      rating: backendBook.rating ?? 0,
      pages: backendBook.pages ?? 0,
      pages_read: backendBook.pages_read ?? 0,
      reading_status: backendBook.reading_status ?? 'Por leer',
      isbn: backendBook.isbn ?? '',
      userId: backendBook.userId
    };
  }

  private mapFrontendToBackend(frontendBook: BookInterface, userId: string): Omit<BackendBook, 'id'> {
    return {
      title: frontendBook.title,
      author: frontendBook.author,
      isbn: frontendBook.isbn ?? '',
      cover: frontendBook.portrait_url,
      description: frontendBook.description ?? '',
      rating: frontendBook.rating ?? 0,
      pages: frontendBook.pages ?? 0,
      pages_read: frontendBook.pages_read ?? 0,
      reading_status: frontendBook.reading_status ?? 'Por leer',
      userId
    };
  }

}
