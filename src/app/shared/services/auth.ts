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

    let userSrt = localStorage.getItem(user.username)

    if (userSrt && user.password === JSON.parse(userSrt)['password']) {
      sessionStorage.setItem('userLogged', user.username);
      this.verifyUserLogged();
      return {success: true, redirectTo: "home"};
    }

    return {success: false};

  }

  signUp(user: User): SignUpResponse {

    if (localStorage.getItem(user.username)) {
      return {success: false, message: 'Usuario ya existe'};
    }

    localStorage.setItem(user.username, JSON.stringify(user));
    sessionStorage.setItem('userLogged', user.username);
    this.verifyUserLogged();
    return {success: true, redirectTo: 'home'}

  }

  resetPassword(user: User): ResetPasswordResponse {
    const userStr = localStorage.getItem(user.username);

    if (!userStr) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    // Parse the data from the user's Json
    const existingUser = JSON.parse(userStr) as User;

    if (user.email && existingUser.email !== user.email) {
      return { success: false, message: 'El correo electronico no coincide con el usuario' };
    }

    // Updating password and rePassword from the original user.
    existingUser.password = user.password;
    existingUser.rePassword = user.rePassword;

    localStorage.setItem(user.username, JSON.stringify(existingUser));

    return { success: true, redirectTo: 'login' };
  }

  private verifyUserLogged() {
    this.isLogged.set(!!sessionStorage.getItem('userLogged'))
  }


  logout() {
    sessionStorage.clear();
    this.verifyUserLogged();
  }

  getUserLogged() {

    if (!!sessionStorage.getItem('userLogged')) {
      return {
        username: sessionStorage.getItem('userLogged'),
        email: sessionStorage.getItem('userLogged')!
      }
    }
    return {
      username: 'Bienvenido',
      email: 'ejemplo@mail.com'
    }
  }
}

