import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../shared/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  private authService = inject(Auth);
  user = this.authService.getUserLogged();

  stats = {
    booksRead: this.user.stats?.booksRead || 0,
    reviewsCount: this.user.stats?.reviewsCount || 0,
    followersCount: this.user.stats?.followersCount || 0,
    followingCount: this.user.stats?.followingCount || 0
  };

  routeLinks = {
    followers: '/followers',
    following: '/following'
  };
}
