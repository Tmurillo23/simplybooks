import { Component,inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { Auth } from "../../../shared/services/auth"


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [
    RouterLink,
    FormsModule
  ],
  styleUrl: './home.css'
})
export class Home {

  authService = inject(Auth);
  router = inject(Router);

  onProfile() {
    this.router.navigate(['/profile']);
  }
  onCollection(){}

  onBorrow(){}

  onSearch(){}
  onLogout(){
    this.authService.logout();
    this.router.navigateByUrl('')
  }

}
