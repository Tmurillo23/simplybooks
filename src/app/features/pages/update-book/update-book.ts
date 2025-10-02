import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookshelfService } from '../../../shared/services/bookshelf';
import { BookInterface } from '../../../shared/interfaces/book-interface';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.html',
  imports: [
    FormsModule
  ],
  styleUrl: './update-book.css'
})
export class UpdateBook {
  book?: BookInterface;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookshelfService: BookshelfService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.bookshelfService.bookshelvesItems().find(b => b.id === id);
    if (found) {
      this.book = { ...found };
    }
  }

  saveChanges() {
    if (this.book) {
       if (this.bookshelfService.updateBook(this.book)){
         alert('Libro actualizado con exito')
         this.router.navigate([`/editbook/${this.book.id}`]);
         return;
       } else{
         alert('Error en la actualización')
         return;
       }
    }
  }

}
