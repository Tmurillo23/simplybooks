import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { LoginResponse, LoginServiceResponse } from '../interfaces/login-response';
import { JwtService } from './jwt-service';
import { SignUpResponse, SignUpServiceResponse } from '../interfaces/sign-up-response';
import { ResetPasswordResponse, ResetPasswordServiceResponse } from '../interfaces/reset-password-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);
  private jwtService = inject(JwtService);

  isLogged = signal(false);
  private apiUrl = 'http://localhost:3000/api/v1/auth';
  currentUser = signal<User | null>(null);

  constructor() {
    this.verifyLoggedUser();
  }

  login(user: User): Observable<LoginResponse> {
    return this.http.post<LoginServiceResponse>(`${this.apiUrl}/login`, user).pipe(
      map(response => {
        sessionStorage.setItem('token', response.token);

        this.verifyLoggedUser();
        return {
          success: true,
          redirectTo: 'home'
        };
      }),
      catchError((error) => {
        let message = 'Error during login';
        if (error.status === 401) {
          message = 'Invalid credentials';
        }
        return [{ success: false, message }];
      })
    );
  }

  signUp(user: User): Observable<SignUpResponse> {
    return this.http.post<SignUpServiceResponse>(`${this.apiUrl}/register`, user).pipe(
      map(response => {
        sessionStorage.setItem('token', response.token);

        this.verifyLoggedUser();
        return {
          success: true,
          redirectTo: 'home'
        };
      }),
      catchError((error) => {
        let message = 'Error during register';
        if (error.status === 409 || error.status === 400) {
          message = 'The user already exists.';
        }
        return [{ success: false, message }];
      })
    );
  }

  resetPassword(user: User): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordServiceResponse>(`${this.apiUrl}/reset-password`, user).pipe(
      map(response => {
        return {
          success: true,
          message: response.message,
          redirectTo: 'login'
        };
      }),
      catchError((error) => {
        let message = 'Error during password reset';
        if (error.status === 404) {
          message = 'User not found';
        } else if (error.status === 400) {
          message = 'Invalid request';
        }
        return [{ success: false, message }];
      })
    );
  }

  logout() {
    sessionStorage.clear();
    this.verifyLoggedUser();
  }

  getUserLogged(): User {
    let user = this.jwtService.decodeToken();

    if (!user) {
      return {
        id: '0',
        username: 'unknown-user',
        password: '',
        email: 'no-user',
        rePassword: '',
        avatar: '',
        created_at: new Date(0),
        biography: '',
        following: false,
        stats: {
          booksRead: 0,
          reviewsCount: 0,
          followersCount: 0,
          followingCount: 0
        }
      };
    }

    // Retornamos el usuario decodificado con valores seguros por defecto
    return {
      id: user.id || '0',
      username: user.username || 'unknown-user',
      password: '',
      email: user.email || 'no-user',
      rePassword: '',
      avatar: user.avatar_url || '',
      created_at: user.created_at ? new Date(user.created_at) : new Date(0),
      biography: user.bio || '',
      following: user.following ?? false,
      stats: user.stats || {
        booksRead: 0,
        reviewsCount: 0,
        followersCount: 0,
        followingCount: 0
      }
    };
  }
  updateCurrentUser(updatedUser: Partial<User>): void {
    const currentUser = this.currentUser();
    if (currentUser) {
      this.currentUser.set({ ...currentUser, ...updatedUser });
    }
  }

  isTokenExpired() {
    return this.jwtService.isTokenExpired();
  }

  private verifyLoggedUser() {
    this.isLogged.set(!!sessionStorage.getItem('token'))
  }

}
