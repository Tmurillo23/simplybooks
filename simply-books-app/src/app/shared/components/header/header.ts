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
  imports: [FormsModule,RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  authService = inject(Auth);
  userService = inject(UserService);
  followService = inject(FollowService);
  router = inject(Router);

  isLogged = this.authService.isLogged;

  // 🔍 Signals
  searchQuery = signal('');
  allUsers = signal<User[]>([]);
  searchResults = signal<User[]>([]);
  isDropdownVisible = signal(false);

  constructor() {
    // ✅ Carga inicial de usuarios en el signal correcto
    this.userService.findAll().subscribe({
      next: (users) => {
        this.allUsers.set(users); // ✅ correcto
        console.log('Usuarios cargados:', users);
      },
      error: (err) => console.error(err)
    });

    // Efecto reactivo: filtra los usuarios mientras se escribe
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

  onProfile() {
    this.router.navigate(['/profile']);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

  goToUserProfile(username: string) {
    this.isDropdownVisible.set(false);
    this.router.navigate(['/profile', username]);
  }

  followUser(user: User) {
    const wasFollowing = this.followService.getFollowingUsers()
      .some(u => u.username === user.username && u.following);

    if (wasFollowing) {
      this.followService.unfollowUser(user.username);
      alert(`Has dejado de seguir a ${user.username}`);
    } else {
      this.followService.followUser(user.username);
      alert(`Ahora sigues a ${user.username}`);
    }
  }

  onBlur() {
    setTimeout(() => this.isDropdownVisible.set(false), 150);
  }

  // Saber si ya sigues a un usuario
  isFollowing(username: string): boolean {
    return this.followService.getFollowingUsers().some(
      u => u.username === username && u.following
    );
  }

}
