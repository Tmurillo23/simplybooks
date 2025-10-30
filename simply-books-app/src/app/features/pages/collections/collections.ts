import { Component, computed, inject, signal } from '@angular/core';
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

  collections = signal<CollectionInterface[]>([]);
  search = signal('');

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    const user = this.authService.getUserLogged();

    if (!user || !user.username) {
      console.warn('No hay usuario logueado.');
      this.collections.set([]);
      return;
    }

    this.collections.set(this.collectionService.getCollectionsByUser(user));
  }

  // Filtro por nombre
  filteredCollections = computed(() => {
    const term = this.search().toLowerCase();
    if (!term) return this.collections();
    return this.collections().filter(c =>
      c.name.toLowerCase().includes(term)
    );
  });

  // Eliminar con confirmación
  deleteCollection(id: string): void {
    Swal.fire({
      title: '¿Eliminar colección?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        try {
          this.collectionService.deleteCollection(id);
          this.collections.update(list => list.filter(c => c.id !== id));
          Swal.fire('Eliminado', 'La coleccion se elimino correctamente.', 'success');
        } catch (error: any) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    });
  }
}
