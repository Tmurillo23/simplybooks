import { Component, inject } from '@angular/core';
import { CollectionService } from '../../../shared/services/collections-service';
import { Auth } from '../../../shared/services/auth';
import { CollectionInterface } from '../../../shared/interfaces/collection-interface';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.html',
  imports: [RouterLink],
  standalone: true,
  styleUrls: ['./collections.css']
})
export class Collections {
  private collectionService = inject(CollectionService);
  private authService = inject(Auth);

  collections: CollectionInterface[] = [];

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    const user = this.authService.getUserLogged();

    if (!user || !user.username) {
      console.warn('⚠️ No hay usuario logueado.');
      this.collections = [];
      return;
    }

    this.collections = this.collectionService.getCollectionsByUser(user);
  }

  /** Eliminar colección con confirmación */
  deleteCollection(id: string): void {
    Swal.fire({
      title: '¿Eliminar colección?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        try {
          this.collectionService.deleteCollection(id);
          // Actualizar la lista local
          this.collections = this.collections.filter(c => c.id !== id);
          Swal.fire('Eliminado', 'La colección se eliminó correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    });
  }

  toggleVisibility(id: string): void {
    try {
      this.collectionService.toggleVisibility(id);
      // Actualizar localmente la colección afectada
      const collection = this.collections.find(c => c.id === id);
      if (collection) {
        collection.is_public = !collection.is_public;
      }
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  }


}
