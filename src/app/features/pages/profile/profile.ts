import { Component,inject } from '@angular/core';
import {RouterLink} from '@angular/router';
import { Auth } from '../../../shared/services/auth';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  authService = inject(Auth);
  username = this.authService.getUserLogged();
  email = 'emmfdsfdksj';
}
