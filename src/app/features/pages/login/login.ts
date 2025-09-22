import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Auth } from "../../../shared/services/auth";
import { User } from "../../../shared/interfaces/user";
import Swal from 'sweetalert2'

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

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  })


  onLogin() {
    if (!this.loginForm.valid) {
      Swal.fire({
        title: "Ops!",
        text: "El formulario no es valido",
        icon: "error"
      });
      return;
    }
    let user = this.loginForm.value as User;

    let response = this.authService.login(user);
    if (response.success) {
      this.router.navigate(['home'])
      return;
    }
    Swal.fire({
      title: "Ops!",
      text: response.message,
      icon: "error"
    });

  }

}
