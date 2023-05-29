// In this file we want the custom validator that compares the values from two inputboxes, password and confirmpassword.
import { FormGroup } from '@angular/forms';
    
export function ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        //checking if password and confirm password is equal or not -> returns true
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            //console.log(matchingControl.errors)
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            //if password & confirmpassword matches, return errors as null
            matchingControl.setErrors(null);
        }
    }
}