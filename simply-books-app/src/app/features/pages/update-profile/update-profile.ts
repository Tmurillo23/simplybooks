import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../shared/services/auth';
import { CustomValidators } from '../../../validators/custom.validator';
import Swal from 'sweetalert2';
import { User } from '../../../shared/interfaces/user';
import { Storage } from '../../../shared/services/storage';
import { UserService } from '../../../shared/services/user-service';
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorModule, FormsModule],
  templateUrl: './update-profile.html',
  styleUrls: ['./update-profile.css']
})
export class UpdateProfile implements OnInit {
  router = inject(Router);
  fb = inject(FormBuilder);
  authService = inject(Auth);
  storageService = inject(Storage);
  userService = inject(UserService);
  customValidators = inject(CustomValidators);

  currentUser!: User;
  profileForm!: FormGroup;

  ngOnInit(): void {
    this.currentUser = this.authService.getUserLogged();

    // inicializar formulario después de tener el usuario
    this.profileForm = this.fb.group({
      username: [
        this.currentUser.username,
        {
          validators: [Validators.required],
          asyncValidators: [this.customValidators.usernameExistsValidator()],
          updateOn: 'blur'
        }
      ],
      biography: [this.currentUser.biography || '']
    });
  }

  // En update-profile.component.ts
  onUpdateProfile() {
    if (this.profileForm.invalid) {
      Swal.fire({
        icon: 'warning',
        text: 'Completa los campos correctamente'
      });
      return;
    }

    const formValue = this.profileForm.getRawValue();
    const updatedUser: Partial<User> = {
      username: formValue.username || this.currentUser.username,
      biography: formValue.biography || this.currentUser.biography
    };

    this.userService.update(this.currentUser.id!, updatedUser)
      .subscribe({
        next: () => {
          // Actualizar el usuario en el servicio Auth
          this.authService.updateCurrentUser(updatedUser);

          Swal.fire({
            icon: 'success',
            text: 'Perfil actualizado correctamente',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigateByUrl('/profile');
        },
        error: (err) => {
          console.error('Error al actualizar perfil', err);
          Swal.fire({
            icon: 'error',
            text: 'No se pudo actualizar el perfil'
          });
        }
      });
  }

  onUploadFile(event: Event) {
    const inputTarget = event.target as HTMLInputElement;
    if (!inputTarget.files || inputTarget.files.length <= 0) return;

    const imageFile = inputTarget.files[0];

    if (!imageFile.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        text: 'Por favor selecciona un archivo de imagen válido'
      });
      return;
    }

    this.storageService.uploadAvatar(imageFile, this.currentUser.email)
      .then(filePath => {
        const imageUrl = this.storageService.getFileUrl(filePath, 'avatar');

        this.userService.update(this.currentUser.id!, { avatar: imageUrl })
          .subscribe({
            next: () => {
              // Actualizar el avatar en el servicio Auth
              this.authService.updateCurrentUser({ avatar: imageUrl });

              Swal.fire({
                icon: 'success',
                text: 'Avatar actualizado correctamente',
                timer: 1500,
                showConfirmButton: false
              });
              this.router.navigateByUrl('/profile');
            },
            error: (err) => {
              console.error('Error al actualizar en BD:', err);
              Swal.fire({
                icon: 'error',
                text: 'Error al guardar el avatar en la base de datos'
              });
            }
          });
      })
      .catch(error => {
        console.error('Error detallado:', error);
        Swal.fire({
          text: error.message || 'Error al cargar la imagen',
          icon: 'error'
        });
      });
  }
}
