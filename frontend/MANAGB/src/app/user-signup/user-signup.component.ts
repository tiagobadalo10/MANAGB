import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup , Validators} from '@angular/forms';
import { alphanumericValidator } from '../validators/alphanumeric.directive';
import { UserService } from '../services/user.service'
import { Router } from '@angular/router';
import { User } from '../models/user';
import { passwordtypeValidator } from '../validators/passwordtype.directive';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {

  signupForm!: FormGroup;

  constructor(private userService : UserService, private router: Router, private appcomponent: AppComponent){}

  ngOnInit(): void {
         
      this.signupForm = new FormGroup({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          alphanumericValidator(),
        ]        
        ), 
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          alphanumericValidator(),
          passwordtypeValidator()
        ])
      })
     
  }

  
  onSubmit(): void{

    this.userService.getUsers().subscribe(users => {
      var exists = false;

      for(var i = 0; i < users.length; i++){
        var user = users[i];
        if(user.name == this.signupForm.value.name){
          exists = true;
        }
    }

    if(exists){
      this.signupForm.controls['name'].setErrors({'unique': true});
    }
    else{
      this.userService.register(this.signupForm.value.name, this.signupForm.value.password).subscribe();
      this.router.navigate(['/dashboard']);
    }
    });
  }

  get name(){
    return this.signupForm.get('name')!;
  }

  get password(){
    return this.signupForm.get('password')!;
  }
}
