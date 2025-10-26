import { Injectable, signal, inject, computed } from '@angular/core';
import { Loan } from '../interfaces/loan-interface';
import { BookshelfService } from './bookshelf';

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  private readonly STORAGE_KEY = 'simplybooks_loans';
  private _loans = signal<Loan[]>([]);

  bookshelfService = inject(BookshelfService);

  constructor() {
    this.loadLoans();
    this.syncLoanedBooks();
  }

  // Todos los préstamos (activos + históricos)
  get loans() {
    return this._loans;
  }

  // Solo préstamos activos (no devueltos)
  activeLoans = computed(() =>
    this._loans().filter(loan => !loan.returned)
  );

  // Historial de préstamos devueltos
  loanHistory = computed(() =>
    this._loans()
      .filter(loan => loan.returned)
      .sort((a, b) => {
        // Ordenar por fecha de devolución (más reciente primero)
        const dateA = a.returnDate ? new Date(a.returnDate).getTime() : 0;
        const dateB = b.returnDate ? new Date(b.returnDate).getTime() : 0;
        return dateB - dateA;
      })
  );

  // Estadísticas
  stats = computed(() => {
    const allLoans = this._loans();
    const active = this.activeLoans().length;
    const total = allLoans.length;
    const returned = total - active;

    return {
      total,
      active,
      returned
    };
  });

  private loadLoans() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const loans = parsed.map((loan: any) => ({
          ...loan,
          loanDate: new Date(loan.loanDate),
          returnDate: loan.returnDate ? new Date(loan.returnDate) : undefined
        }));
        this._loans.set(loans);
      } catch (error) {
        console.error('Error loading loans:', error);
      }
    }
  }

  private saveLoans() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._loans()));
  }

  private syncLoanedBooks() {
    const activeLoans = this.activeLoans();
    activeLoans.forEach(loan => {
      this.bookshelfService.markAsLoaned(loan.book.id);
    });
  }

  addLoan(loan: Loan) {
    this._loans.update(loans => [...loans, loan]);
    this.saveLoans();

    // Marcar el libro como prestado en la biblioteca
    this.bookshelfService.markAsLoaned(loan.book.id);
  }

  updateLoan(updatedLoan: Loan) {
    this._loans.update(loans =>
      loans.map(loan => loan.id === updatedLoan.id ? updatedLoan : loan)
    );
    this.saveLoans();

    // Si se marca como devuelto, marcar libro como disponible
    if (updatedLoan.returned) {
      this.bookshelfService.markAsAvailable(updatedLoan.book.id);
    }
  }

  // Marcar préstamo como devuelto
  markAsReturned(loanId: string) {
    this._loans.update(loans =>
      loans.map(loan => {
        if (loan.id === loanId && !loan.returned) {
          const updatedLoan = {
            ...loan,
            returned: true,
            returnDate: new Date() // ← Registrar fecha de devolución
          };
          this.bookshelfService.markAsAvailable(loan.book.id);
          return updatedLoan;
        }
        return loan;
      })
    );
    this.saveLoans();
  }

  removeLoan(id: string) {
    const loan = this._loans().find(l => l.id === id);
    if (loan && !loan.returned) {
      this.bookshelfService.markAsAvailable(loan.book.id);
    }

    this._loans.update(loans => loans.filter(loan => loan.id !== id));
    this.saveLoans();
  }

  // Verificar si un libro está prestado
  isBookLoaned(bookId: number): boolean {
    return this.activeLoans().some(loan => loan.book.id === bookId);
  }

  // Obtener préstamos de un libro específico
  getBookLoanHistory(bookId: number): Loan[] {
    return this._loans()
      .filter(loan => loan.book.id === bookId)
      .sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime());
  }

  // Obtener préstamos de un beneficiario
  getBeneficiaryLoans(beneficiary: string): Loan[] {
    return this._loans()
      .filter(loan => loan.beneficiary.toLowerCase() === beneficiary.toLowerCase())
      .sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime());
  }

  // Limpiar historial (opcional - con confirmación)
  clearHistory() {
    if (confirm('¿Estás seguro de que quieres eliminar TODO el historial de préstamos? Esta acción no se puede deshacer.')) {
      this._loans.set([]);
      this.saveLoans();
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
