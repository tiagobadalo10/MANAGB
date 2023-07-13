import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

export function alphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const alphanumeric = !control.value.match(/^[0-9A-Za-z]+$/);
      
      return alphanumeric ? {alphanumeric: {value: control.value}} : null;
    };
  }

  @Directive({
    selector: '[appAlphanumeric]',
    providers: [{provide: NG_VALIDATORS, useExisting: alphanumericValidator, multi: true}]
  })

  export class AlphanumericValidatorDirective implements Validator {
    @Input('appAlphanumeric') alphanumeric = '';
  
    validate(control: AbstractControl): ValidationErrors | null {
      return this.alphanumeric ? alphanumericValidator()(control)
                                : null;
    }
  }
  