import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionInterface } from '../../../shared/interfaces/collection-interface';
import { BookShelfItem } from '../../../shared/services/bookshelf';
import { CollectionService } from '../../../shared/services/collections-service';
import { BookshelfService } from '../../../shared/services/bookshelf';
import {BookInterface} from '../../../shared/interfaces/book-interface';

@Component({
  selector: 'app-edit-collection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-collection.html',
  styleUrls: ['./edit-collection.css']
})
export class EditCollection implements OnInit {
  collection?: CollectionInterface;
  availableBooks: BookShelfItem[] = [];
  selectedBookId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private bookshelfService: BookshelfService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.collection = this.collectionService.getCollectionById(id);
    }
    // Cargamos los libros del usuario desde el BookshelfService
    this.availableBooks = this.bookshelfService.bookshelvesItems;
  }

  updateCollection(): void {
    if (!this.collection) return;
    this.collectionService.updateCollection(this.collection.id, {
      name: this.collection.name,
      description: this.collection.description,
    });
    alert('Colección actualizada correctamente');
  }


  addBook(book: BookShelfItem) {
    if (!this.collection) return;

    try {
      this.collectionService.addBookToCollection(this.collection.id, book);
    } catch (error: any) {
      alert(error.message);
    }
  }


  removeBook(bookId: number): void {
    if (!this.collection) return;

    try {
      this.collectionService.removeBookFromCollection(this.collection.id, bookId);
    } catch (error: any) {
      alert(error.message);
    }
  }
}
