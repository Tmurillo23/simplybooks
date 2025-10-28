import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FollowService } from '../../../shared/services/follow-service';
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
  stats = { followers: 0, following: 0 };

  constructor(private followingService: FollowService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.users = this.followingService.getFollowingUsers();
    this.stats = this.followingService.getFollowStats();
    this.loading = false;
  }

  toggleFollow(u: User): void {
    if (u.following) {
      this.unfollow(u);
    } else {
      this.follow(u);
    }
    this.stats = this.followingService.getFollowStats(); // 🔸 vuelve a calcular después del cambio
  }

  private follow(u: User): void {
    const prev = !!u.following;
    const ok = this.followingService.followUser(u.username);
    if (ok) {
      u.following = true;
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
