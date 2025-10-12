import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { BookshelfService } from '../../../shared/services/bookshelf';
import { BookInterface } from '../../../shared/interfaces/book-interface';
import {FormsModule} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.html',
  imports: [
    FormsModule],
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
         Swal.fire({
           title: "Completado!",
           text: "Libro actualizado con exito",
           icon: "success"
         });
         this.router.navigate([`/editbook/${this.book.id}`]);
         this.router.navigate(['/home']);
         return;
       } else{
         Swal.fire({
           title: "Error",
           text: "Error en la actualización",
           icon: "error"
         });
         return;
       }
    }
  }

}
