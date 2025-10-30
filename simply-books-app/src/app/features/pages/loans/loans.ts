import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Loan } from '../../../shared/interfaces/loan-interface';
import { BookshelfService } from '../../../shared/services/bookshelf';
import { BookInterface } from '../../../shared/interfaces/book-interface';
import { LoansService } from '../../../shared/services/loan-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './loans.html',
  styleUrls: ['./loans.css'], // ← corregido
})
export class Loans implements OnInit {
  newLoan: Partial<Loan> = {};

  bookshelfService = inject(BookshelfService);
  loansService = inject(LoansService);

  ngOnInit() {
    // Cargar préstamos al inicializar
    this.loansService.loans();
  }

  addLoan() {
    if (!this.newLoan.beneficiary || !this.newLoan.book || !this.newLoan.loanDate) {
      Swal.fire({ title: 'Error', text: 'Por favor completa todos los campos.', icon: 'error' });
      return;
    }

    const book = this.newLoan.book;

    // No prestar libros digitales
    if (book.file_url) {
      Swal.fire({ title: 'Error', text: 'Este libro es diigtal y no se puede prestar fisicamente.', icon: 'error' });
      return;
    }

    // Verificar si el libro ya está prestado
    if (this.loansService.isBookLoaned(book.id)) {
      Swal.fire({ title: 'Error', text: 'Este libro ya está prestado.', icon: 'error' });
      return;
    }

    // Crear el préstamo
    const loan: Loan = {
      id: uuidv4(),
      beneficiary: this.newLoan.beneficiary,
      book: book,
      loanDate: new Date(this.newLoan.loanDate),
      returned: false,
    };

    // Agregar préstamo y eliminar libro de la biblioteca
    this.loansService.addLoan(loan);

    // Limpiar formulario
    this.newLoan = {};
    Swal.fire({ title: 'Prestamo registrado', text: 'Este prestaqmo fue registrado exitosamente.', icon: 'success' });
  }

  markReturned(loan: Loan) {
    if (confirm(`¿Confirmas que ${loan.beneficiary} devolvió "${loan.book.title}"?`)) {
      this.loansService.markAsReturned(loan.id);
      Swal.fire({ title: 'Libro devuelto y agregado', text: 'Fue exitosamente devuelto y agregado.', icon: 'success' });
    }
  }

  get activeLoans() {
    return this.loansService.activeLoans();
  }

  get availableBooks(): BookInterface[] {
    // Solo libros físicos que no están prestados
    return this.bookshelfService.bookshelvesItems
      .filter(book => !book.file_url);
  }

  get stats() {
    return this.loansService.stats();
  }

  get hasAvailableBooks(): boolean {
    return this.availableBooks.length > 0;
  }

  get hasActiveLoans(): boolean {
    return this.activeLoans.length > 0;
  }

  isLoanable(book: BookInterface): boolean {
    return !book.file_url && !this.loansService.isBookLoaned(book.id);
  }

  calculateDaysSinceLoan(loanDate: Date): number {
    const today = new Date().getTime();
    const loan = new Date(loanDate).getTime();
    const days = Math.floor((today - loan) / (1000 * 60 * 60 * 24));
    return days;
  }
}
