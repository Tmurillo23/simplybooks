// typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FollowingService } from '../../../shared/services/following-service';
import { User } from '../../../shared/interfaces/user';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './following.html',
  styleUrls: ['./following.css']
})
export class Following implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(private followingService: FollowingService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    // Servicio síncrono: obtener copia inmediata de la lista
    this.users = this.followingService.getFollowingUsers();
    this.loading = false;
  }

  toggleFollow(u: User): void {
    if (u.following) {
      this.unfollow(u);
    } else {
      this.follow(u);
    }
  }

  private follow(u: User): void {
    // actualizar estado local basándonos en la respuesta síncrona
    const prev = !!u.following;
    const ok = this.followingService.followUser(u.username);
    if (ok) {
      u.following = true;
      // si el usuario no estaba previamente en la lista, aseguramos reflejar datos mínimos
      if (!this.users.find(x => x.username === u.username)) {
        this.users.push({ ...u, following: true } as User);
      }
    } else {
      u.following = prev;
    }
  }

  private unfollow(u: User): void {
    const prev = !!u.following;
    const ok = this.followingService.unfollowUser(u.username);
    if (ok) {
      u.following = false;
    } else {
      u.following = prev;
    }
  }

  trackByUsername(_: number, u: User): string {
    return u.username;
  }
}
