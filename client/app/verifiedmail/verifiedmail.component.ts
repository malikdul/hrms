import { Component,OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Router } from '@angular/router';


@Component({
    selector: 'app-verified',
    templateUrl: './verifiedmail.component.html',
    styleUrls: ['./verifiedmail.component.scss']
  })
  export class VerifiedmailComponent  {
      user={};
    
    
      constructor(
        public toast: ToastComponent,
        private router: Router,
        private userService: UserService) { }

 
  verifiedmail() {
    this.userService.verifiedmail(this.user).subscribe(
      res => {
    
        console.log('Responce received!');
        this.toast.setMessage('Account has been verified!!', 'success')
       // this.router.navigate(['/login'])
    },
    error => {
      console.log('Error Client end!!');
      console.log(error)
    }
    );
  }


}