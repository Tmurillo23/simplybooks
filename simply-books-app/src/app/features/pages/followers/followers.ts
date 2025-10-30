import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowService } from '../../../shared/services/follow-service';
import { Auth } from '../../../shared/services/auth';
import { User } from '../../../shared/interfaces/user';

@Component({
  selector: 'app-followers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './followers.html',
  styleUrls: ['./followers.css']
})
export class Followers implements OnInit {
  private followService = inject(FollowService);
  private auth = inject(Auth);

  followers: User[] = [];
  loading = false;
  currentUserId!: string;

  ngOnInit(): void {
    const user = this.auth.getUserLogged();
    if (!user) return;
    this.currentUserId = user.id!;
    this.loadFollowers();
  }

  loadFollowers(): void {
    this.loading = true;
    this.followService.getFollowers(this.currentUserId).subscribe({
      next: (res) => {
        this.followers = res;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  followBack(u: User): void {
    this.followService.followUser(this.currentUserId, u.id!).subscribe(() => {
      u.following = true;
    });
  }

  removeFollower(u: User): void {
    this.followService.unfollowUser(this.currentUserId, u.id!).subscribe(() => {
      this.loadFollowers();
    });
  }
}
