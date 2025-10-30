import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

const MOCK_FOLLOWING: User[] = [
  {
    username: 'ana',
    password: '',
    email: '',
    avatar: '/assets/avatars/ana.jpg',
    biography: 'Lectora voraz',
    stats: { booksRead: 42, reviewsCount: 12, followersCount: 120, followingCount: 45 },
    following: true
  },
  {
    username: 'luis',
    password: '',
    email: '',
    avatar: '/assets/avatars/luis.jpg',
    biography: 'Reseñador',
    stats: { booksRead: 30, reviewsCount: 8, followersCount: 80, followingCount: 20 },
    following: true
  }
];

const MOCK_FOLLOWERS: User[] = [
  {
    username: 'marcela',
    password: '',
    email: '',
    avatar: '/assets/avatars/marcela.jpg',
    biography: 'Amo las novelas históricas',
    stats: { booksRead: 15, reviewsCount: 3, followersCount: 40, followingCount: 10 },
    following: false
  },
  {
    username: 'carlos',
    password: '',
    email: '',
    avatar: '/assets/avatars/carlos.jpg',
    biography: 'Fan de la ciencia ficción',
    stats: { booksRead: 25, reviewsCount: 5, followersCount: 60, followingCount: 18 },
    following: false
  }
];

@Injectable({ providedIn: 'root' })
export class FollowService {
  private following: User[] = MOCK_FOLLOWING.slice();
  private followers: User[] = MOCK_FOLLOWERS.slice();

  getFollowingUsers(): User[] {
    return this.following.slice();
  }

  getFollowers(): User[] {
    return this.followers.slice();
  }

  followUser(identifier: string): boolean {
    const idx = this.following.findIndex(u => u.username === identifier);
    if (idx >= 0) {
      this.following[idx].following = true;
    } else {
      this.following.push({ username: identifier, password: '', email: '', following: true } as User);
    }
    return true;
  }

  unfollowUser(identifier: string): boolean {
    const idx = this.following.findIndex(u => u.username === identifier);
    if (idx >= 0) {
      this.following[idx].following = false;
      return true;
    }
    return false;
  }

  getFollowStats(): { followers: number; following: number } {
    const following = this.following.filter(u => u.following).length;
    const followers = this.followers.length;
    return { followers, following };
  }
}
