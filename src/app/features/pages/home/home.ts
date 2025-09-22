import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

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
  searchTerm=""
  constructor(private router: Router) {}

  onProfile() {
    this.router.navigate(['/profile']);
  }

  onCollection(){}

  onBorrow(){}

  onSearch(){}
}
