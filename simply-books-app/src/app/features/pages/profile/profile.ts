import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../../../shared/services/auth';
import { ReviewService } from '../../../shared/services/review-service';
import { BookshelfService, BookShelfItem } from '../../../shared/services/bookshelf';
import { ReviewInterface } from '../../../shared/interfaces/review-interface';
import { CollectionInterface } from '../../../shared/interfaces/collection-interface';
import { CollectionService } from '../../../shared/services/collections-service';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { UserService } from '../../../shared/services/user-service';
import { User } from '../../../shared/interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, EditorModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  authService = inject(Auth);
  reviewService = inject(ReviewService);
  collectionService = inject(CollectionService);
  bookshelfService = inject(BookshelfService);
  userService = inject(UserService);
  activatedRoute = inject(ActivatedRoute);

  user!: User;
  viewingOwnProfile = false;

  readonlyEditorConfig = {
    menubar: false,
    toolbar: false,
    statusbar: false,
    height: 200,
    width: 400,
    readonly: true,
    content_style: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 16px; }',
    setup: (editor: any) => {
      editor.on('init', () => editor.mode.set('readonly'));
    }
  };

  stats = {
    booksRead: 0,
    reviewsCount: 0,
    followersCount: 0,
    followingCount: 0
  };

  recentReviews: ReviewInterface[] = [];
  recentLibrary: BookShelfItem[] = [];
  recentCollections: CollectionInterface[] = [];

  constructor() {
    // Refresca datos si otro componente pide actualización
    effect(() => {
      if (this.userService.profileNeedsUpdate()) {
        this.refreshUserData();
        this.userService.profileNeedsUpdate.set(false);
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const username = params.get('username');
      const currentUser = this.authService.getUserLogged();

      // Si no hay username en la ruta o coincide con el del usuario logueado → es su propio perfil
      this.viewingOwnProfile = !username || username === currentUser.username;

      const userToLoad = this.viewingOwnProfile ? currentUser.username : username!;

      this.userService.findByUsername(userToLoad).subscribe({
        next: (res) => {
          this.user = res;
          this.updateStats();
          this.loadLibrary();
          this.loadReviews();
          this.loadCollections();
        },
        error: (err) => Swal.fire({ title: 'Error en el perfil', text: 'Error cargando el perfil.', icon: 'error' })
      });
    });
  }

  refreshUserData() {
    if (!this.user) return;
    this.userService.findByUsername(this.user.username).subscribe({
      next: (res) => {
        this.user = res;
        this.updateStats();
      },
      error: (err) => Swal.fire({ title: 'Error de usuario', text: 'No se pudo refrescar el usuario.', icon: 'error' })
    });
  }

  private updateStats() {
    this.stats.booksRead = this.user.stats?.booksRead || 0;
    this.stats.followersCount = this.user.stats?.followersCount || 0;
    this.stats.followingCount = this.user.stats?.followingCount || 0;
  }

  /** Últimas reseñas */
  private loadReviews() {
    const reviews = this.reviewService.getReviewsForUser(this.user.email).filter(r => !r.draft);
    this.recentReviews = [...reviews].slice(-5).reverse();
    this.stats.reviewsCount = reviews.length;
  }

  /** Últimos libros */
  private async loadLibrary() {
    await this.bookshelfService.loadUserFiles(this.user);
    const allBooks = this.bookshelfService.bookshelvesItems;
    this.recentLibrary = [...allBooks].slice(-5).reverse();
  }

  /** Últimas colecciones */
  private loadCollections() {
    const collections = this.collectionService.getCollectionsByUser(this.user);
    this.recentCollections = [...collections].slice(-5).reverse();
  }

  goTo(type: string): any[] {
    switch (type) {
      case 'library': return ['/home', this.user.username];
      case 'reviews': return(['/reviews', this.user.username]);
      case 'collections': return(['/collections', this.user.username]);
      default: return(['/']);
    }
  }

  goToItem(type: string, id: any): any[] {
    switch (type) {
      case 'library': return(['/book', id]);
      case 'reviews': return(['/review', id]);
      case 'collection': return(['/collection', id]);
      default: return(['/']);
    }
  }
}
