import { Component, inject } from '@angular/core';
import { Loan } from '../../../shared/interfaces/loan-interface';
import { LoansService } from '../../../shared/services/loan-service';

@Component({
  selector: 'app-loan-history',
  standalone: true,
  templateUrl: './loan-history.html',
  styleUrls: ['./loan-history.css'],
})
export class LoanHistory {
  loansService = inject(LoansService);

  // Historial de préstamos devueltos
  get history(): Loan[] {
    return this.loansService.loanHistory();
  }

  // Estadísticas generales de préstamos
  get stats() {
    return this.loansService.stats();
  }

  // Eliminar un préstamo específico
  deleteLoan(loanId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      this.loansService.removeLoan(loanId);
    }
  }

  // Limpiar TODO el historial de préstamos
  clearAllHistory() {
    this.loansService.clearHistory();
  }

  // Calcular duración del préstamo en días
  calculateLoanDuration(loan: Loan): number {
    if (!loan.returnDate) return 0;
    const start = new Date(loan.loanDate).getTime();
    const end = new Date(loan.returnDate!).getTime();
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }
}
