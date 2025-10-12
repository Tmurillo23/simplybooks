import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class CustomValidators {

  controlValuesAreEqual(A: string, B: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const valueA = formGroup.get(A)?.value;
      const valueB = formGroup.get(B)?.value;

      if (valueA === valueB) {
        return null;
      } else {
        return { valuesDoNotMatch: true };
      }
    };
  }

  customEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value) ? null : { invalidEmail: true };
    };
  }


  usernameExistsValidator(): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const username = control.value;
      if (!username) return null;

      // Recorremos todos los usuarios en localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)!;
        const userStr = localStorage.getItem(key);
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.username === username) {
            return { usernameTaken: true };
          }
        }
      }

      return null;
    };
  }

  passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

      return regex.test(value) ? null : { passwordComplexity: true };
    };
  }
}
