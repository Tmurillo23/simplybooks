import {Component, effect, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { Auth } from '../../../shared/services/auth';
import { ReviewService } from '../../../shared/services/review-service';
import { BookshelfService, BookShelfItem } from '../../../shared/services/bookshelf';
import { ReviewInterface } from '../../../shared/interfaces/review-interface';
import { CollectionInterface } from '../../../shared/interfaces/collection-interface';
import {CollectionService} from '../../../shared/services/collections-service';
import {FormsModule} from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import {UserService} from '../../../shared/services/user-service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, FormsModule,EditorModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
   authService = inject(Auth);
   reviewService = inject(ReviewService);
   collectionService = inject(CollectionService);
   bookshelfService = inject(BookshelfService);
   user = this.authService.getUserLogged()
  readonlyEditorConfig = {
    menubar: false,
    toolbar: false,
    statusbar: false,
    height: 200,
    width: 400,
    readonly: true,
    content_style: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 16px; }',
    setup: (editor: any) => {
      editor.on('init', () => {
        editor.mode.set('readonly');
      });
    }
  };
  stats = {
    booksRead: this.user.stats?.booksRead || 0,
    reviewsCount: 0,
    followersCount: this.user.stats?.followersCount || 0,
    followingCount: this.user.stats?.followingCount || 0
  };
  recentReviews: ReviewInterface[] = [];
  recentLibrary: BookShelfItem[] = [];
  recentCollections: CollectionInterface[] = [];
  userService = inject(UserService);

  ngOnInit() {
    this.user = this.authService.getUserLogged();
    this.loadLibrary();
    this.loadReviews();
    this.loadCollections();

    console.log('👤 Usuario en perfil:', this.user);
  }

  constructor() {
    effect(() => {
      if (this.userService.profileNeedsUpdate()) {
        console.log('🔁 Perfil necesita actualización, refrescando...');
        this.refreshUserData();
        this.userService.profileNeedsUpdate.set(false); // Reinicia el flag
      }
    });
  }

  refreshUserData() {
    const current = this.authService.getUserLogged();
    this.userService.findById(current.id!).subscribe({
      next: (res) => {
        this.user = res; // o tu método correspondiente
        console.log('✅ Usuario actualizado:', res);
      },
      error: (err) => console.error('❌ Error refrescando usuario', err)
    });
  }



  /** Últimas 5 reseñas publicadas */
  private loadReviews() {
    const reviews = this.reviewService
      .getReviewsForUser(this.user.email)
      .filter(r => !r.draft);
    this.recentReviews = [...reviews].slice(-5).reverse();
    this.stats.reviewsCount = reviews.length;
  }

  /** Últimos 5 libros agregados a la librería personal */
  private async loadLibrary() {
    await this.bookshelfService.loadUserFiles();
    const allBooks = this.bookshelfService.bookshelvesItems;
    this.recentLibrary = [...allBooks].slice(-5).reverse();
  }

  /** Últimas 5 colecciones creadas */
  private loadCollections() {
    const collections = this.collectionService.getCollectionsByUser(this.user);
    this.recentCollections = [...collections].slice(-5).reverse();
  }

  /** Enlaces principales (clic en el título del bloque) */
  goTo(type: string): any[] {
    switch (type) {
      case 'library': return ['/home', this.user.username];
      case 'reviews': return ['/reviews', this.user.username];
      case 'collections': return ['/collections', this.user.username];
      default: return ['/'];
    }
  }

  /** Enlace al ítem específico */
  goToItem(type: string, id: any): any[] {
    switch (type) {
      case 'library': return ['/book', id];
      case 'reviews': return ['/review', id];
      case 'collections': return ['/collection', id];
      default: return ['/'];
    }
  }
}
