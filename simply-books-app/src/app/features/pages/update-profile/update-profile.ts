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
  imports: [ ReactiveFormsModule, EditorModule, FormsModule],
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
  profileForm = this.fb.group({
    username: [
'',
   {
        validators: [Validators.required],
        asyncValidators: [this.customValidators.usernameExistsValidator()],
        updateOn: 'blur'
      }
    ],
    biography: ['', []]
  });

  ngOnInit(): void {
    this.currentUser = this.authService.getUserLogged();
    console.log('👤 Usuario actual en update:', this.currentUser);

  }

  onUpdateProfile() {
    console.log('🟢 onUpdateProfile ejecutado');

    if (this.profileForm.invalid) {
      Swal.fire({
        icon: 'warning',
        text: 'Completa los campos correctamente'
      });
      return;
    }

    const {username, biography} = this.profileForm.value;
    this.currentUser.username = username || this.currentUser.username;
    this.currentUser.biography = biography || this.currentUser.biography;

    this.userService.update(this.currentUser.id!, { username:username!, biography:biography! })
      .subscribe({
        next: (response: any) => {
          console.log('✅ Respuesta del servidor:', response);
          this.userService.profileNeedsUpdate.set(true);

          Swal.fire({
            icon: 'success',
            text: 'Perfil actualizado correctamente',
            timer: 1500,
            showConfirmButton: false
          });

          setTimeout(() => {
            this.router.navigateByUrl('/profile');
          }, 200);
        },
        error: (err) => {
          console.error('❌ Error al actualizar perfil', err);
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

    console.log('📤 Subiendo avatar...');

    this.storageService.uploadAvatar(imageFile, this.currentUser.email)
      .then(filePath => {
        const imageUrl = this.storageService.getFileUrl(filePath, 'avatar');
        const avatarUpdate = {avatar: imageUrl};

        this.userService.update(this.currentUser.id!, avatarUpdate).subscribe(
          response => {
            this.router.navigateByUrl('/profile');
          }
        );
      })
    .catch(error => {
      console.log(error);
      Swal.fire({
        text: 'Error al cargar la imagen',
        icon: 'error'
      })
    });
  }
}
