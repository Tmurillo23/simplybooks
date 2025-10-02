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

    // Buscar todos los usuarios y encontrar el que tenga el username indicado
    const storedUser = this.getAllUsers().find(u => u.username === user.username);
    if (!storedUser) return { success: false };

    if (user.password === storedUser.password) {
      sessionStorage.setItem('userLogged', storedUser.email); // Guardamos email en sesión
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

    localStorage.setItem(user.email, JSON.stringify(user)); // Guardamos con email como key
    sessionStorage.setItem('userLogged', user.email); // Guardamos email en sesión
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

  getUserLogged() {
    const email = sessionStorage.getItem('userLogged');
    if (!email) return { username: 'Bienvenido', email: 'ejemplo@mail.com', password: '' };

    const userStr = localStorage.getItem(email);
    if (!userStr) return { username: 'Bienvenido', email: 'ejemplo@mail.com', password: '' };

    const user = JSON.parse(userStr) as User;
    return {
      username: user.username,
      email: user.email,
      password: user.password
    };
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
