import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../shared/services/auth';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  private authService = inject(Auth);
  user = this.authService.getUserLogged();
}
