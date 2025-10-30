import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { UserService } from '../../services/user-service';
import { FollowService } from '../../services/follow-service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  authService = inject(Auth);
  userService = inject(UserService);
  followService = inject(FollowService);
  router = inject(Router);

  // 🔐 Estado de sesión
  isLogged = this.authService.isLogged;
  currentUser = this.authService.getUserLogged();

  // 🔍 Signals
  searchQuery = signal('');
  allUsers = signal<User[]>([]);
  searchResults = signal<User[]>([]);
  isDropdownVisible = signal(false);
  followingList = signal<string[]>([]); // guarda IDs de los usuarios seguidos

  constructor() {
    // ✅ Carga inicial de usuarios
    this.userService.findAll().subscribe({
      next: (users) => this.allUsers.set(users),
      error: (err) => console.error('Error cargando usuarios', err),
    });

    // ✅ Carga inicial de seguidos (solo si está logueado)
    if (this.currentUser) {
      this.followService.getFollowing(this.currentUser.id!).subscribe({
        next: (users) => {
          const ids = users.map(u => u.id!);
          this.followingList.set(ids);
        },
        error: (err) => console.error('Error cargando seguidos', err),
      });
    }

    // 🧠 Efecto reactivo: buscar usuarios mientras se escribe
    effect(() => {
      const query = this.searchQuery().trim().toLowerCase();
      if (query.length > 1) {
        const filtered = this.allUsers().filter(u =>
          u.username.toLowerCase().includes(query)
        );
        this.searchResults.set(filtered);
        this.isDropdownVisible.set(true);
      } else {
        this.searchResults.set([]);
        this.isDropdownVisible.set(false);
      }
    });
  }

  // 👤 Ir al perfil propio
  onProfile() {
    this.router.navigate(['/profile']);
  }

  // 🚪 Cerrar sesión
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

  // 🔗 Ir al perfil de otro usuario
  goToUserProfile(username: string) {
    this.isDropdownVisible.set(false);
    this.router.navigate(['/profile', username]);
  }

  // ❤️ Seguir / dejar de seguir a un usuario
  followUser(user: User) {
    const current = this.currentUser;
    if (!current) return;

    const isFollowing = this.followingList().includes(user.id!);

    if (isFollowing) {
      // Dejar de seguir
      this.followService.unfollowUser(current.id!, user.id!).subscribe({
        next: () => {
          alert(`Has dejado de seguir a ${user.username}`);
          this.followingList.update(list => list.filter(id => id !== user.id));
        },
        error: () => alert('Error al dejar de seguir'),
      });
    } else {
      // Seguir
      this.followService.followUser(current.id!, user.id!).subscribe({
        next: () => {
          alert(`Ahora sigues a ${user.username}`);
          this.followingList.update(list => [...list!, user.id!]);
        },
        error: () => alert('Error al seguir usuario'),
      });
    }
  }

  // 👁️ Saber si ya sigo a un usuario
  isFollowing(userId: string): boolean {
    return this.followingList().includes(userId);
  }

  // 🔽 Cierra el dropdown al perder foco
  onBlur() {
    setTimeout(() => this.isDropdownVisible.set(false), 150);
  }
}
