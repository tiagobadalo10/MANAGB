import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

export function passwordtypeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordtype = !control.value.match("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])");
      
      return passwordtype ? {passwordtype: {value: control.value}} : null;
    };
  }

  @Directive({
    selector: '[appPasswordtype]',
    providers: [{provide: NG_VALIDATORS, useExisting: passwordtypeValidator, multi: true}]
  })

  export class PasswordtypeValidatorDirective implements Validator {
    @Input('appAlphanumeric') passwordtype = '';
  
    validate(control: AbstractControl): ValidationErrors | null {
      return this.passwordtype ? passwordtypeValidator()(control)
                                : null;
    }
  }
  