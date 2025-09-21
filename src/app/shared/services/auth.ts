import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { LoginResponse, SignUpResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  isLogged = signal(false);

  constructor(){
    this.verifyUserLogged();
  }

  login(user: User): LoginResponse {

    let userSrt = localStorage.getItem(user.username)

    if (userSrt && user.password === JSON.parse(userSrt)['password']) {
      sessionStorage.setItem('userLogged', user.username);
      this.verifyUserLogged();
      return { success: true, redirectTo: "home" };
    }

    return { success: false };

  }

  signUp(user:User):SignUpResponse {

    if (localStorage.getItem(user.username)) {
      return{ success:false, message:'Usuario ya existe' };
    }

    localStorage.setItem(user.username, JSON.stringify(user));
    sessionStorage.setItem('userLogged', user.username);
    this.verifyUserLogged();
    return {success:true, redirectTo:'home'}

  }

  private verifyUserLogged(){
    this.isLogged.set(!!sessionStorage.getItem('userLogged'))
  }


  logout(){
    sessionStorage.clear();
    this.verifyUserLogged();
  }

  getUserLogged(){

    if(!!sessionStorage.getItem('userLogged')){
      return {
        username:sessionStorage.getItem('userLogged')!
      }
    }
    return {
      username:'Bienvenido'
    }
  }


  private getUser(username:string){

  }

}
