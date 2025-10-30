import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class FollowService {
  private apiUrl = 'http://localhost:3000/v1/followers'; // Ajusta si tu backend usa otro puerto/base

  constructor(private http: HttpClient) {}

  // ➕ Seguir usuario
  followUser(userId: string, followedId: string): Observable<any> {
    const body = { userId, followedId };
    return this.http.post(`${this.apiUrl}`, body);
  }

  // ❌ Dejar de seguir
  unfollowUser(userId: string, followedId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${userId}/following/${followedId}`);
  }

  // 👥 Obtener lista de personas que sigo
  getFollowing(userId: string): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/following`).pipe(
      map((res) => res.map(r => r.followed))
    );
  }

  getFollowers(userId: string): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/followers`).pipe(
      map((res) => res.map(r => r.follower))
    );
  }

  checkFollowing(userId: string, followedId: string): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/following/${followedId}`).pipe(
      map(res => !!res)
    );
  }
}
