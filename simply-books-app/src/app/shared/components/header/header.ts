import { Component,inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { Auth } from "../../services/auth"


@Component({
  selector:'app-header',
    imports: [
        RouterLink
    ],
  templateUrl:'./header.html',
  styleUrl:'./header.css'
})
export class Header {
  authService = inject(Auth);
  router = inject(Router);
  isLogged = this.authService.isLogged;

  onProfile() {
    this.router.navigate(['/profile']);
  }

  onLogout(){
    this.authService.logout();
    this.router.navigateByUrl('')
  }


}
