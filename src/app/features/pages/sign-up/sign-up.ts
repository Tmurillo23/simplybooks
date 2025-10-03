import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../shared/services/auth';
import { User } from '../../../shared/interfaces/user';
import { CustomValidators } from '../../../validators/custom.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {

  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(Auth);
  customValidators = inject(CustomValidators);

  title = 'Registro de usuario';

  // Formulario con validadores
  signUpForm = this.fb.group({
    username: ['', [Validators.required], [this.customValidators.usernameExistsValidator()]],
    email: ['', [Validators.required, this.customValidators.customEmailValidator()]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), this.customValidators.passwordComplexityValidator()]],
    rePassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), this.customValidators.passwordComplexityValidator()]],
  }, {
    validators: this.customValidators.controlValuesAreEqual('password', 'rePassword')
  });

  onSignUp() {
    if (!this.signUpForm.valid) {
      Swal.fire({
        title: "Error",
        text: 'Faltan campos por diligenciar o sus datos son incorrectos.',
        icon: "error"
      });
      return;
    }

    let user = this.signUpForm.value as User;
    let signUpResponse = this.authService.signUp(user);

    if (signUpResponse?.success) {
      Swal.fire({
        title: "Success",
        text: "Usuario creado con éxito",
        icon: "success",
      });
      this.router.navigate([signUpResponse.redirectTo]);
    } else {
      Swal.fire({
        title: "Error",
        text: "El formulario no es válido",
        icon: "error"
      });
    }
  }

}
