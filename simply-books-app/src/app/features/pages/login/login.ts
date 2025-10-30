import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Auth } from "../../../shared/services/auth";
import { User } from "../../../shared/interfaces/user";
import Swal from 'sweetalert2'
import {CustomValidators} from '../../../validators/custom.validator';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {


  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(Auth);
  customValidators = inject(CustomValidators);

  loginForm = this.fb.group({
    email: ['', [Validators.required, this.customValidators.customEmailValidator]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  })


  onLogin() {
    if (!this.loginForm.valid) {
      Swal.fire({
        title: "Error",
        text: "El formulario no es valido",
        icon: "error"
      });
      return;
    }
    let user = this.loginForm.value as User;

    this.authService.login(user).subscribe(response => {
      if (response.success) {
        this.router.navigate(['home']);
      } else {
        Swal.fire({
          title: "Error",
          text: response.message || "Ingreso fallido.",
          icon: "error"
        });
      }
    });
  }

  }
