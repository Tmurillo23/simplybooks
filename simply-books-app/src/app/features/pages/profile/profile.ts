import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Auth } from '../../../shared/services/auth';
import { ReviewService } from '../../../shared/services/review-service';
import { BookshelfService, BookShelfItem } from '../../../shared/services/bookshelf';
import { ReviewInterface } from '../../../shared/interfaces/review-interface';
import { CollectionInterface } from '../../../shared/interfaces/collection-interface';
import { CollectionService } from '../../../shared/services/collections-service';
import { EditorModule } from '@tinymce/tinymce-angular';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, EditorModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit, OnDestroy {
  authService = inject(Auth);
  reviewService = inject(ReviewService);
  collectionService = inject(CollectionService);
  bookshelfService = inject(BookshelfService);
  router = inject(Router);
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

  private destroy$ = new Subject<void>();

  recentReviews: ReviewInterface[] = [];
  recentLibrary: BookShelfItem[] = [];
  recentCollections: CollectionInterface[] = [];

  user: any = null;
  stats = {
    booksRead: 0,
    reviewsCount: 0,
    followersCount: 0,
    followingCount: 0
  };

  async ngOnInit() {
    console.log('🎯 Profile ngOnInit iniciado');

    // Cargar datos iniciales
    await this.loadInitialData();

    // Suscribirse a cambios en el usuario
    this.setupUserSubscription();

    // Suscribirse a eventos de navegación para detectar cuando volvemos
    this.setupNavigationSubscription();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadInitialData() {
    // Siempre obtener el usuario más reciente
    this.user = this.authService.getUserLogged();
    console.log('🔍 Usuario cargado en loadInitialData:', this.user);

    if (!this.user || this.user.username === 'unknown-user') {
      console.warn('Usuario no autenticado o token inválido');
      return;
    }

    await this.loadAllData();
  }

  private setupUserSubscription() {
    console.log('🎯 Configurando suscripción a user$');

    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          console.log('🎯 Profile recibió actualización de usuario:', user);

          if (user && user.username !== 'unknown-user') {
            // Siempre actualizar si hay un usuario válido
            const userChanged = this.hasUserChanged(user);
            console.log('🔄 ¿Usuario cambió?:', userChanged);

            this.user = user;
            console.log('✅ Profile actualizado con nuevo usuario:', this.user);

            // Recargar datos si el usuario cambió
            if (userChanged) {
              this.loadAllData();
            }
          }
        },
        error: (error) => {
          console.error('❌ Error en suscripción user$:', error);
        }
      });
  }

  private setupNavigationSubscription() {
    // Detectar cuando navegamos de vuelta al profile
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        if (event.url === '/profile' || event.urlAfterRedirects === '/profile') {
          console.log('🔄 Regresamos a /profile, recargando usuario...');
          // Forzar recarga del usuario desde el token
          this.user = this.authService.getUserLogged();
          this.loadAllData();
        }
      });
  }

  private hasUserChanged(newUser: any): boolean {
    if (!this.user) return true;

    // Comparar propiedades clave en lugar de JSON completo
    const keyPropsChanged =
      newUser.username !== this.user.username ||
      newUser.biography !== this.user.biography ||
      newUser.avatar !== this.user.avatar ||
      newUser.email !== this.user.email;

    console.log('🔄 Propiedades clave cambiaron:', keyPropsChanged);
    return keyPropsChanged;
  }

  private updateStats() {
    if (!this.user) return;

    this.stats = {
      booksRead: this.user.stats?.booksRead || 0,
      reviewsCount: this.recentReviews.length,
      followersCount: this.user.stats?.followersCount || 0,
      followingCount: this.user.stats?.followingCount || 0
    };

    console.log('📊 Estadísticas actualizadas:', this.stats);
  }

  private async loadAllData() {
    console.log('🔄 Cargando todos los datos del perfil...');
    await this.loadLibrary();
    this.loadReviews();
    this.loadCollections();
    this.updateStats();
  }

  loadReviews() {
    if (!this.user?.email) return;

    const reviews = this.reviewService
      .getReviewsForUser(this.user.email)
      .filter(r => !r.draft);

    this.recentReviews = [...reviews].slice(-5).reverse();
    this.updateStats();
  }

  async loadLibrary() {
    await this.bookshelfService.loadUserFiles();
    const allBooks = this.bookshelfService.bookshelvesItems;
    this.recentLibrary = [...allBooks].slice(-5).reverse();
  }

  private loadCollections() {
    if (!this.user) return;

    const collections = this.collectionService.getCollectionsByUser(this.user);
    this.recentCollections = [...collections].slice(-5).reverse();
  }

  goTo(type: string): any[] {
    const username = this.user?.username || 'unknown-user';
    switch (type) {
      case 'library': return ['/home', username];
      case 'reviews': return ['/reviews', username];
      case 'collections': return ['/collections', username];
      default: return ['/'];
    }
  }

  goToItem(type: string, id: any): any[] {
    switch (type) {
      case 'library': return ['/book', id];
      case 'reviews': return ['/review', id];
      case 'collections': return ['/collection', id];
      default: return ['/'];
    }
  }

  // Método para debug
  debugUser() {
    console.log('🐛 Usuario actual en Profile:', this.user);
    console.log('🐛 Usuario en AuthService signal:', this.authService.currentUser());
    console.log('🐛 Token en sessionStorage:', sessionStorage.getItem('token'));
  }
}
