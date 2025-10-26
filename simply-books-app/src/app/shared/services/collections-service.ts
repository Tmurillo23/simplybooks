import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CollectionInterface } from '../interfaces/collection-interface';
import { BookInterface } from '../interfaces/book-interface';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  private collections: CollectionInterface[] = [];

  constructor() {}

  /** Crear nueva colección */
  createCollection(
    user: User,
    name: string,
    description?: string
  ): CollectionInterface {
    const userCollections = this.collections.filter(c => c.user.username === user.username);
    if (userCollections.length >= 10) {
      throw new Error('El usuario ya alcanzó el máximo de 10 colecciones.');
    }

    const newCollection: CollectionInterface = {
      id: uuidv4(),
      user,
      name: name.trim(),
      description: description?.trim(),
      books: [],
      created_at: new Date(),
      updated_at: new Date()
    };

    this.collections.push(newCollection);
    return newCollection;
  }

  /** Obtener colecciones del usuario */
  getCollectionsByUser(user: User): CollectionInterface[] {
    return this.collections.filter(c => c.user.username === user.username);
  }

  /** Obtener colección por ID */
  getCollectionById(id: string): CollectionInterface | undefined {
    return this.collections.find(c => c.id === id);
  }

  /** Actualizar datos básicos de una colección */
  updateCollection(id: string, updatedData: Partial<CollectionInterface>): CollectionInterface {
    const collection = this.collections.find(c => c.id === id);
    if (!collection) throw new Error('Colección no encontrada.');
    Object.assign(collection, updatedData, { updated_at: new Date() });
    return collection;
  }

  /** Eliminar una colección */
  deleteCollection(id: string): void {
    const index = this.collections.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Colección no encontrada.');
    this.collections.splice(index, 1);
  }

  /** Agregar un libro (existente en bookshelf) */
  addBookToCollection(collectionId: string, book: BookInterface): void {
    const collection = this.collections.find(c => c.id === collectionId);
    if (!collection) throw new Error('Colección no encontrada.');

    const exists = collection.books.some(b => b.id === book.id);
    if (exists) throw new Error('El libro ya está en esta colección.');

    collection.books.push(book);
    collection.updated_at = new Date();
  }

  /** Eliminar libro de colección */
  removeBookFromCollection(collectionId: string, bookId: number): void {
    const collection = this.collections.find(c => c.id === collectionId);
    if (!collection) throw new Error('Colección no encontrada.');

    const index = collection.books.findIndex(b => b.id === bookId);
    if (index === -1) throw new Error('El libro no se encuentra en la colección.');

    collection.books.splice(index, 1);
    collection.updated_at = new Date();
  }


}
