import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Auth } from '../../../shared/services/auth';
import { User } from '../../../shared/interfaces/user';
import Swal from 'sweetalert2';

// TODO: authService
// TODO: Custom validator
// TODO: HTML template
// TODO: INSTALL SWAL

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService= inject(Auth);
  ruta = '';
  title = 'Login-Page'
  validators = [Validators.required, Validators.minLength(8)];
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', this.validators]
  })

  onLogin() {
    if (!this.loginForm.valid) {
      Swal.fire({icon: "error",
        title: "Ingreso fallido",
        text: "Intenta de nuevo"})
      return;
    }
    let user = this.loginForm.value as User;
    let loginResponse = this.authService.login(user)
    if (!loginResponse.success) {
      this.router.navigate([loginResponse.redirectTo])
    } else {
      Swal.fire({
        icon: "error",
        title: "Ingreso fallido",
        text: "Intenta de nuevo"
      })
    }
  }
}
