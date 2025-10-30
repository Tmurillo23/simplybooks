import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../shared/services/auth';
import { User } from '../../../shared/interfaces/user';
import { CustomValidators } from '../../../validators/custom.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  fb = inject(FormBuilder);

  router = inject(Router);

  authService = inject(Auth);

  customValidators = inject(CustomValidators);

  ruta = '';

  title = 'Recuperar Contraseña';

  validators = [Validators.required, Validators.minLength(4)];

  resetPasswordForm = this.fb.group({
    username:['', [Validators.required]],
    email:['', [Validators.required]],
    newPassword:['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), this.customValidators.passwordComplexityValidator()]],
    reNewPassword:['', [Validators.required, Validators.minLength(6), Validators.maxLength(16), this.customValidators.passwordComplexityValidator()]],
  }, {
    validators : this.customValidators.controlValuesAreEqual('newPassword', 'reNewPassword')
  })

  onResetPassword(){
    if(!this.resetPasswordForm.valid){
        Swal.fire(
          {title: "Error",
            text: 'Faltan campos por diligenciar o sus datos son incorrectos.',
            icon: "error"
          });
      return;
    }

    let user: User = {
      username: this.resetPasswordForm.value.username!,
      email: this.resetPasswordForm.value.email!,
      password: this.resetPasswordForm.value.newPassword!,
      rePassword: this.resetPasswordForm.value.reNewPassword!,
    };
    this.authService.resetPassword(user).subscribe(response => {
        if(!!response.success) {
          Swal.fire(
            {
              title: "Exitoso",
              text: response.message,
              icon: "success",
            });
          this.router.navigate([response.redirectTo]);
        }
        else{
            Swal.fire(
              {title: "Error",
                text: response.message,
                icon: "error"
              });
          }
    });

  }
}
