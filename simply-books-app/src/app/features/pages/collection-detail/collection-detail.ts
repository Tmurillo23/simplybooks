import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CollectionInterface } from '../../../shared/interfaces/collection-interface';
import { BookInterface } from '../../../shared/interfaces/book-interface';
import { CollectionService } from '../../../shared/services/collections-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  // 👇 Aquí agregamos los módulos necesarios
  imports: [RouterModule],
  templateUrl: './collection-detail.html',
  styleUrl: './collection-detail.css'
})
export class CollectionDetail implements OnInit {

  collection: CollectionInterface | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private collectionService = inject(CollectionService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.collectionService.getCollectionById(id);
      if (found) {
        this.collection = found;
      } else {
        Swal.fire({
          title: 'No encontrada',
          text: 'La colección especificada no existe.',
          icon: 'error'
        }).then(() => this.router.navigate(['/collections']));
      }
    }
  }

  removeBook(bookId: number) {
    if (!this.collection) return;
    try {
      this.collectionService.removeBookFromCollection(this.collection.id, bookId);
      this.collection = this.collectionService.getCollectionById(this.collection.id)!;
      Swal.fire({ title: 'Eliminado', text: 'Libro eliminado de la colección.', icon: 'success' });
    } catch (error: any) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
    }
  }

  downloadFile(book: BookInterface) {
    if (!book.file_url) return;
    const a = document.createElement('a');
    a.href = book.file_url;
    a.download = book.title || 'libro';
    a.click();
  }
}
