import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {BookshelfService} from '../../../shared/services/bookshelf';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [FormsModule],
  styleUrl: './home.css'
})
export class Home {
  constructor(public bookshelfService: BookshelfService) {}
}
