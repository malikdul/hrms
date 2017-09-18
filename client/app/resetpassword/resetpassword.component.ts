import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastComponent } from '../shared/toast/toast.component';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  resetpasswordForm: FormGroup;
  id = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required,
                                  Validators.minLength(6)]);
  re_password = new FormControl('', [Validators.required,
                                    Validators.minLength(6)]);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
              private route: ActivatedRoute,              
              private userService: UserService) {this.route.params.subscribe(params => {
               this.id.setValue(params.id);  
              console.log('id',params.id); //<----- + sign converts string value to number
    }); }

  ngOnInit() {
    this.resetpasswordForm = this.formBuilder.group({
      password: this.password,
      re_password: this.re_password,
      id:this.id
     
    });
  }

  
    setClassPassword() {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }
  setClassRe_password() {
    return { 'has-danger': !this.re_password.pristine && !this.re_password.valid };
  }

  resetpassword() {
    console.log(this.re_password.value);
    if(this.password.value==this.re_password.value){
      console.log('Enter in reset part',this.resetpasswordForm.value);

    this.userService.resetpassword(this.resetpasswordForm.value).subscribe(
      
      res => {
        this.toast.setMessage('you successfully Reset your password!', 'success');
        this.router.navigate(['/login']);
      },
      error => this.toast.setMessage('Password not reset please try again!', 'danger')
    );
  } 
  else{
    console.log("else");
    this.toast.setMessage('Password doesnot match.', 'danger')
  }
  }
}
