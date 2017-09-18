import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';

import { AuthService } from '../services/auth.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class forgotpasswordComponent implements OnInit {

  forgotpasswordForm: FormGroup;
  email = new FormControl('', [Validators.required,
                                       Validators.minLength(3),
                                       Validators.maxLength(100)]);

   constructor(private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
                                        private userService: UserService) { }

  ngOnInit() {
    this.forgotpasswordForm = this.formBuilder.group({
      email: this.email,
    });
  }


  setClassEmail() {
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }

  forgotpassword() {
    console.log("Forgot password form value",this.forgotpasswordForm.value);
    
    this.userService.forgotpassword(this.forgotpasswordForm.value).subscribe(
      res => {
        //if(res.email==req.body.email)
        this.toast.setMessage('An Email has been send to your email account!', 'success');
        this.router.navigate(['/login']);
      },
      error => this.toast.setMessage('email doesnot exists', 'danger')
    );
  }
  }


