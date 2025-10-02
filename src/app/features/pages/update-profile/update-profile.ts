import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../shared/services/auth';
import { CustomValidators } from '../../../validators/custom.validator';

@Component({
  selector: 'app-update-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css'
})
export class UpdateProfile implements OnInit {
  router = inject(Router);

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private customValidators = inject(CustomValidators);

  profileForm!: FormGroup;
  currentUser: any;

  ngOnInit(): void {
    this.currentUser = this.authService.getUserLogged();

    this.profileForm = this.fb.group({
      email: [
        { value: this.currentUser.email, disabled: true }, // readonly
        [Validators.required, this.customValidators.customEmailValidator()]
      ],
      username: [
        this.currentUser.username,
        {
          validators: [Validators.required],
          asyncValidators: [this.customValidators.usernameExistsValidator()],
          updateOn: 'blur'
        }
      ]
    });
  }

  onSubmit() {
    if (!this.profileForm.valid) {
      alert('Por favor revisa el nombre de usuario.');
      return;
    }

    const updatedUser = {
      ...this.currentUser,
      username: this.profileForm.value.username
    };

    const response = this.authService.updateUser(updatedUser);

    if (!response.success) {
      alert(response.message || 'Error al actualizar el perfil ');
    } else {
      alert('Nombre de usuario actualizado correctamente ✅');
      this.router.navigate(['/profile']);
    }
  }
}
