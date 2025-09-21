import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../shared/services/auth';
import { User } from '../../../shared/interfaces/user';
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

  ruta = '';

  title = 'Registro de usuario';

  validators = [Validators.required, Validators.minLength(4)];

  signUpForm = this.fb.group({
    username:['', [Validators.required]],
    email:['', [Validators.required]],
    password:['', this.validators],
    rePassword:['',  this.validators],
  })


  onSignUp(){
    if(!this.signUpForm.valid){
      alert('Faltan campos por diligenciar');
      return;
    }
    let user = this.signUpForm.value as User;

    let signUpResponse = this.authService.signUp(user);


    if(!!signUpResponse.success) {
      Swal.fire(
        {
          title: "Success",
          text: "Usuario creado con éxito",
          icon: "success",
        });
      this.router.navigate([signUpResponse.redirectTo]);
    }
    else{
        Swal.fire(
          {title: "Error",
            text: signUpResponse.message,
            icon: "error"
          });
      }
    }

}
