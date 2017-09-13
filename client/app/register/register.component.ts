import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  username = new FormControl('', [Validators.required,
                                  Validators.minLength(2),
                                  Validators.maxLength(30),
                                  Validators.pattern('[a-zA-Z0-9_-\\s]*')]);
  email = new FormControl('', [Validators.required,
                               Validators.minLength(3),
                               Validators.maxLength(100)]);
  password = new FormControl('', [Validators.required,
                                  Validators.minLength(6)]);
  re_password = new FormControl('', [Validators.required,
                                    Validators.minLength(6)]);

  role = new FormControl('', [Validators.required]);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
              private userService: UserService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
      re_password: this.re_password,
      role: this.role
    });
  }

  setClassUsername() {
    return { 'has-danger': !this.username.pristine && !this.username.valid };
  }
  setClassEmail() {
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }
  setClassPassword() {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }
  setClassre_password() {
    return { 'has-danger': !this.re_password.pristine && !this.re_password.valid };
  }

  register() {
    console.log(this.re_password.value);
    if(this.password.value==this.re_password.value){
    this.userService.register(this.registerForm.value).subscribe(
      res => {
        this.toast.setMessage('you successfully registered!', 'success');
        this.router.navigate(['/login']);
      },
      error => this.toast.setMessage('email already exists', 'danger')
    );
  } 
  else{
    console.log("else");
    this.toast.setMessage('Password doesnot match.', 'danger')
  }
  }
}
