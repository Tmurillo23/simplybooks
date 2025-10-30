import { Component, OnInit } from '@angular/core';
import { FollowService } from '../../../shared/services/follow-service';
import { Auth } from '../../../shared/services/auth';
import { User } from '../../../shared/interfaces/user';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [],
  templateUrl: './following.html',
  styleUrls: ['./following.css']
})
export class Following implements OnInit {
  users: User[] = [];
  loading = false;
  stats = { followers: 0, following: 0 };
  currentUserId!: string;

  constructor(
    private followService: FollowService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUserLogged();
    if (!user) return;
    this.currentUserId = user.id!;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.followService.getFollowing(this.currentUserId).subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  toggleFollow(u: User): void {
    if (u.following) {
      this.unfollow(u);
    } else {
      this.follow(u);
    }
  }

  follow(u: User): void {
    this.followService.followUser(this.currentUserId, u.id!).subscribe(() => {
      u.following = true;
    });
  }

  unfollow(u: User): void {
    this.followService.unfollowUser(this.currentUserId, u.id!).subscribe(() => {
      u.following = false;
    });
  }
}
