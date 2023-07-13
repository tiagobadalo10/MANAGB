import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  loginForm!: FormGroup;
  authFail: boolean = false;

  constructor(
    private userService : UserService,
    private formBuilder : FormBuilder,
    private router: Router,
    private appcomponent: AppComponent
    ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {

    var any = this.userService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: (v) => {
        this.appcomponent.setLogged();
        if (v.isAdmin) {this.appcomponent.setAdmin();}
        this.appcomponent.setName(this.loginForm.value.username);
        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        // TODO make the message better ?
        this.authFail = true;
      },
    });
  }

}
