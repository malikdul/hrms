import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserDto, PersonInfo, Skill, Education, JobHistory, Document } from '../dto/user';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  //Variables
  users = [];
  dtoUser = new UserDto();
  isLoading = true;
  isadduser = false;
  isaddskill = false;
  isaddeducation = false;
  isaddjob = false;
  isEditing = false;
  isProfileEditing = false;
  isskillediting = false;
  iseducationediting = false;
  isjobediting = false;
  index;
  //Form Groups
  profileForm: FormGroup;
  username = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required,
  Validators.minLength(6)]);
  role = new FormControl('', [Validators.required]);
  phoneno = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  dob = new FormControl('', [Validators.required]);
  verify = new FormControl('', [Validators.required]);
  status = new FormControl('', [Validators.required]);
  deleted = new FormControl('', [Validators.required]);

  skillForm: FormGroup;
  namefield = new FormControl('', [Validators.required])
  experiencefield = new FormControl('', [Validators.required]);


  educationForm: FormGroup;
  degreename = new FormControl('', [Validators.required]);
  subject = new FormControl('', [Validators.required]);
  institution = new FormControl('', [Validators.required]);
  completionyear = new FormControl('', [Validators.required]);
  percentage = new FormControl('', [Validators.required]);

  jobhistoryForm: FormGroup;
  orgname = new FormControl('', [Validators.required]);
  desg = new FormControl('', [Validators.required]);
  dur = new FormControl('', [Validators.required]);


  constructor(public auth: AuthService,
    public toast: ToastComponent,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      phoneno: this.phoneno,
      address: this.address,
      dob: this.dob,
      verify: this.verify,
      status: this.status,
      deleted: this.deleted
    });

    this.skillForm = this.formBuilder.group({
      name: this.namefield,
      experience: this.experiencefield,
    });
    this.educationForm = this.formBuilder.group({
      degreename: this.degreename,
      subject: this.subject,
      institution: this.institution,
      completionyear: this.completionyear,
      percentage: this.percentage

    });
    this.jobhistoryForm = this.formBuilder.group({
      orgname: this.orgname,
      desg: this.desg,
      dur: this.dur
    })
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }
  enableadduser() {
    this.isadduser = true;
    console.log("Addd user:", this.isadduser);
  }

  enableEditing(i) {
    this.dtoUser = this.users[i];
    console.log("dtoUser", this.dtoUser);
    this.isEditing = true;
  }
  cancelEditing() {
    this.isEditing = false;
    this.isadduser = false;
    this.toast.setMessage('User Editing cancelled.', 'danger');
    this.getUsers();
  }

  enableProfileEditing() {
    this.isProfileEditing = true;
  }

  enableaddskill() {
    this.isaddskill = true;
  }
  enableaddeducation() {
    this.isaddeducation = true;
  }
  enableaddjob() {
    this.isaddjob = true;
  }

  enableskillediting(i) {
    this.index = i;
    this.isskillediting = true;

  }
  enableeducationediting(i) {
    this.index = i;
    this.iseducationediting = true;

  }
  enablejobediting(i) {
    this.index = i;
    this.isjobediting = true;
  }


  addprofile() {
    let pinfo: PersonInfo = this.profileForm.value;
    if (!this.dtoUser.skills) {
      this.dtoUser.skills = [];
    }
    else if (!this.dtoUser.educations) {
      this.dtoUser.educations = [];
    }
    else if (!this.dtoUser.jobhistories) {
      this.dtoUser.jobhistories = [];
    }
    this.dtoUser.pinfo = pinfo;

    this.save();
  }


  addskill() {
    let skill: Skill = this.skillForm.value;
    if (!this.dtoUser.skills) {
      this.dtoUser.skills = [];
    }
    else if (!this.dtoUser.educations) {
      this.dtoUser.educations = [];
    }
    else if (!this.dtoUser.jobhistories) {
      this.dtoUser.jobhistories = [];
    }
    this.dtoUser.skills.push(skill);
    //console.log("user",this.user);
    this.save();
  }

  addeducation() {
    let education: Education = this.educationForm.value;
    if (!this.dtoUser.skills) {
      this.dtoUser.skills = [];
    }
    else if (!this.dtoUser.educations) {
      this.dtoUser.educations = [];
    }
    else if (!this.dtoUser.jobhistories) {
      this.dtoUser.jobhistories = [];
    }
    this.dtoUser.educations.push(education);
    //console.log("user",this.user);
    this.save();
  }

  addjob() {
    let jobhistory: JobHistory = this.jobhistoryForm.value;
    if (!this.dtoUser.skills) {
      this.dtoUser.skills = [];
    }
    else if (!this.dtoUser.educations) {
      this.dtoUser.educations = [];
    }
    else if (!this.dtoUser.jobhistories) {
      this.dtoUser.jobhistories = [];
    }
    this.dtoUser.jobhistories.push(jobhistory);
    this.save();
  }

  reloadForm() {
    this.isaddskill = false;
    this.isaddeducation = false;
    this.isaddjob = false;
    this.isProfileEditing = false;
    this.isskillediting = false;
    this.iseducationediting = false;
    this.isjobediting = false;
    this.skillForm.reset();
    this.educationForm.reset();
    this.jobhistoryForm.reset();
    this.getUsers();
  }
  delete() {

    if (this.isskillediting) {
      this.dtoUser.skills.splice(this.index, 1)
    }
    else if (this.iseducationediting) {
      this.dtoUser.educations.splice(this.index, 1)
    }
    else if (this.isjobediting) {
      this.dtoUser.jobhistories.splice(this.index, 1)
    }
    this.save();
  }

  deleteUser(user) {
    this.userService.deleteUser(user).subscribe(
      res => {
        console.log('Client view', res);
        this.toast.setMessage('user deleted successfully.', 'success')
      },
      error => console.log(error),

      () => this.getUsers()
    );
  }

  save() {
    this.userService.editUser(this.dtoUser).subscribe(
      res => {
        this.toast.setMessage('account settings saved!', 'success')
        this.reloadForm();
      },
      error => console.log(error)
    );
  }

  register() {
    let pinfo: PersonInfo = this.profileForm.value;
    let education: Education = this.educationForm.value;
    let skill: Skill = this.skillForm.value;
    let jobhistory: JobHistory = this.jobhistoryForm.value;
    if (!this.dtoUser.skills) {
      this.dtoUser.skills = [];
    }
    if (!this.dtoUser.educations) {
      this.dtoUser.educations = [];
    }
    if (!this.dtoUser.jobhistories) {
      this.dtoUser.jobhistories = [];
    }
    this.dtoUser.pinfo = pinfo;
    this.dtoUser.skills.push(skill);
    this.dtoUser.educations.push(education);
    this.dtoUser.jobhistories.push(jobhistory);
    this.userService.register(this.dtoUser).subscribe(

      res => {
        this.toast.setMessage('you successfully registered!', 'success');
        this.router.navigate(['/account']);

      },
      error => this.toast.setMessage('email already exists', 'danger')
    );
  }

}
