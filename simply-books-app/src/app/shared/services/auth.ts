import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { LoginResponse, SignUpResponse, ResetPasswordResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  isLogged = signal(false);

  constructor() {
    this.verifyUserLogged();
  }

  login(user: User): LoginResponse {
    if (!user.username) return { success: false };

    const storedUser = this.getAllUsers().find(u => u.username === user.username);
    if (!storedUser) return { success: false, message: 'Error en el formulario' };

    if (user.password === storedUser.password) {
      sessionStorage.setItem('userLogged', storedUser.email);
      this.verifyUserLogged();
      return { success: true, redirectTo: 'home' };
    }

    return { success: false };
  }

  signUp(user: User): SignUpResponse {
    if (!user.username || !user.email) return { success: false, message: 'Usuario inválido' };
    if (localStorage.getItem(user.email)) {
      return { success: false, message: 'Usuario ya existe' };
    }

    localStorage.setItem(user.email, JSON.stringify(user));
    sessionStorage.setItem('userLogged', user.email);
    this.verifyUserLogged();
    return { success: true, redirectTo: 'home' };
  }

  resetPassword(user: User): ResetPasswordResponse {
    const email = sessionStorage.getItem('userLogged') || user.email;
    if (!email) return { success: false, message: 'Usuario no encontrado' };

    const userStr = localStorage.getItem(email);
    if (!userStr) return { success: false, message: 'Usuario no encontrado' };

    const storedUser = JSON.parse(userStr) as User;
    storedUser.password = user.password;
    storedUser.rePassword = user.rePassword;

    localStorage.setItem(email, JSON.stringify(storedUser));
    return { success: true, redirectTo: 'login' };
  }

  private verifyUserLogged() {
    this.isLogged.set(!!sessionStorage.getItem('userLogged'));
  }

  logout() {
    sessionStorage.clear();
    this.verifyUserLogged();
  }

  // Devuelve el objeto User completo almacenado (o un guest user si no hay sesión)
  getUserLogged(): User {
    const email = sessionStorage.getItem('userLogged');
    if (!email) return { username: 'Bienvenido', email: 'ejemplo@mail.com', password: '' } as User;

    const userStr = localStorage.getItem(email);
    if (!userStr) return { username: 'Bienvenido', email: 'ejemplo@mail.com', password: '' } as User;

    try {
      const stored = JSON.parse(userStr) as User;
      const user: User = {
        username: stored.username || '',
        email: stored.email || email,
        password: stored.password || '',
        rePassword: stored.rePassword,
        avatar_url: stored.avatar_url || '/assets/default-avatar.png',
        created_at: stored.created_at,
        bio: stored.bio || '',
        following: typeof stored.following === 'boolean' ? stored.following : false,
        stats: stored.stats || { booksRead: 0, reviewsCount: 0, followersCount: 0, followingCount: 0 }
      } as User;

      return user;
    } catch {
      return { username: 'Bienvenido', email: 'ejemplo@mail.com', password: '' } as User;
    }
  }

  updateUser(updatedUser: User) {
    const email = sessionStorage.getItem('userLogged');
    if (!email) return { success: false, message: 'No hay sesión activa' };

    localStorage.setItem(email, JSON.stringify(updatedUser));
    return { success: true };
  }

  private getAllUsers(): User[] {
    return Object.keys(localStorage)
      .map(key => {
        try {
          return JSON.parse(localStorage.getItem(key) || '');
        } catch {
          return null;
        }
      })
      .filter((u): u is User => !!u);
  }
}
