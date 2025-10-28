import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

const MOCK_FOLLOWING: User[] = [
  {
    username: 'ana',
    password: '',
    email: '',
    avatar_url: '/assets/avatars/ana.jpg',
    bio: 'Lectora voraz',
    stats: { booksRead: 42, reviewsCount: 12, followersCount: 120, followingCount: 45 },
    following: true
  } as User,
  {
    username: 'luis',
    password: '',
    email: '',
    avatar_url: '/assets/avatars/luis.jpg',
    bio: 'Reseñador',
    stats: { booksRead: 30, reviewsCount: 8, followersCount: 80, followingCount: 20 },
    following: true
  } as User
];

@Injectable({ providedIn: 'root' })
export class FollowingService {
  private users: User[] = MOCK_FOLLOWING.slice();

  constructor() {}

  // Devuelve copia de la lista local (síncrono)
  getFollowingUsers(): User[] {
    return this.users.slice();
  }

  // Seguir: marca como seguido o crea una entrada mínima
  followUser(identifier: string): boolean {
    const idx = this.users.findIndex(u => u.username === identifier);
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], following: true };
    } else {
      this.users.push({
        username: identifier,
        password: '',
        email: '',
        following: true
      } as User);
    }
    return true;
  }

  unfollowUser(identifier: string): boolean {
    const idx = this.users.findIndex(u => u.username === identifier);
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], following: false };
      return true;
    }
    return false;
  }

  // Consulta rápida y síncrona
  isFollowing(identifier: string): boolean {
    const u = this.users.find(u => u.username === identifier);
    return !!u && !!u.following;
  }

  // Opcional: limpiar o reemplazar la lista (síncrono)
  setFollowingUsers(list: User[]): void {
    this.users = list.map(u => ({ ...u }));
  }
}
