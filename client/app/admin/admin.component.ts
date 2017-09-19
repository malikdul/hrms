import { Component, OnInit } from '@angular/core';

import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  user = {};
  isEditing = false;
  users = [];
  isLoading = true;

  constructor(public auth: AuthService,
              public toast: ToastComponent,
              private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => this.users = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }
  enableEditing(user) {
    this.isEditing = true;
    this.user = user;
  }
  cancelEditing() {
    this.isEditing = false;
    this.user = {};
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getUsers();
  }
  editUser(user) {
    this.userService.editUser(user).subscribe(
      res => {
        this.isEditing = false;
        this.user = user;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }


  deleteUser(user) {
    this.userService.deleteUser(user).subscribe(
      data => this.toast.setMessage('user deleted successfully.', 'success'),
      error => console.log(error),
      () => this.getUsers()
    );
  }

}
