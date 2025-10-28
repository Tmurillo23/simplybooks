import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FollowService } from '../../../shared/services/follow-service';
import { User } from '../../../shared/interfaces/user';

@Component({
  selector: 'app-followers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './followers.html',
  styleUrls: ['./followers.css']
})
export class Followers implements OnInit {
  private followService = inject(FollowService);

  followers: User[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadFollowers();
  }

  loadFollowers(): void {
    this.loading = true;
    // Obtener los usuarios que te siguen
    this.followers = this.followService.getFollowers();
    this.loading = false;
  }

  followBack(u: User): void {
    this.followService.followUser(u.username);
    this.loadFollowers();
  }

  removeFollower(u: User): void {
    this.followService.unfollowUser(u.username);
    this.loadFollowers();
  }

  trackByUsername(_: number, u: User): string {
    return u.username;
  }
}
