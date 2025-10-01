import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class CustomValidators {
    controlValuesAreEqual(A : string, B : string): ValidatorFn {
        return (control : AbstractControl) : ValidationErrors | null => {
        const formGroup = control as FormGroup
        const valueA = formGroup.get(A)?.value
        const valueB = formGroup.get(B)?.value

        if (valueA === valueB){
            return null
        } else {
            return { valuesDoNotMatch : true }
        }
    }
  }
}