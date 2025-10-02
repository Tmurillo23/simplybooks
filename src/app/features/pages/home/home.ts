import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {BookshelfService} from '../../../shared/services/bookshelf';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [FormsModule, RouterLink],
  styleUrl: './home.css'
})
export class Home {
  constructor(public bookshelfService: BookshelfService) {}

  removeBook(id: number) {
    this.bookshelfService.removeBook(id);
    alert('📚 Libro eliminado de la estantería');
  }

}
