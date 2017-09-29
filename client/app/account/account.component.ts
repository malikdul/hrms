import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserDto, PersonInfo, Skill, Education, JobHistory, Document } from '../dto/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  //Form Groups
  profileForm: FormGroup;
  username = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  role = new FormControl('', [Validators.required]);
  phoneno = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  dob = new FormControl('', [Validators.required]);
  skill = new FormControl('', [Validators.required]);

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

  //Variables
  user = new UserDto();
  isLoading = true;
  isaddskill = false;
  isaddeducation = false;
  isaddjob = false;
  isProfileEditing = false;
  isskillediting = false;
  iseducationediting = false;
  isjobediting = false;
  index;
  constructor(
    private auth: AuthService,
    public toast: ToastComponent,
    private formBuilder: FormBuilder,
    private userService: UserService) { }
  //From Builder
  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      role: this.role,
      phoneno: this.phoneno,
      address: this.address,
      dob: this.dob,
      skill: this.skill
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
    this.getUser();
  }
  //Functions
  getUser() {
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => {
        this.user = data
        console.log("User",this.user);
      },
      error => console.log(error),
      () => this.isLoading = false
    );
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
    if (!this.user.skills) {
      this.user.skills = [];
    }
    else if (!this.user.educations) {
      this.user.educations = [];
    }
    else if (!this.user.jobhistories) {
      this.user.jobhistories = [];
    }
    this.user.pinfo = pinfo;

    this.save();
  }


  addskill() {
    let skill: Skill = this.skillForm.value;
    if (!this.user.skills) {
      this.user.skills = [];
    }
    else if (!this.user.educations) {
      this.user.educations = [];
    }
    else if (!this.user.jobhistories) {
      this.user.jobhistories = [];
    }
    this.user.skills.push(skill);
    //console.log("user",this.user);
    this.save();
  }

  addeducation() {
    let education: Education = this.educationForm.value;
    if (!this.user.skills) {
      this.user.skills = [];
    }
    else if (!this.user.educations) {
      this.user.educations = [];
    }
    else if (!this.user.jobhistories) {
      this.user.jobhistories = [];
    }
    this.user.educations.push(education);
    //console.log("user",this.user);
    this.save();
  }

  addjob() {
    let jobhistory: JobHistory = this.jobhistoryForm.value;
    if (!this.user.skills) {
      this.user.skills = [];
    }
    else if (!this.user.educations) {
      this.user.educations = [];
    }
    else if (!this.user.jobhistories) {
      this.user.jobhistories = [];
    }
    this.user.jobhistories.push(jobhistory);
    this.save();
  }

  reload() {
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
    this.getUser();
  }
  delete() {

    if (this.isskillediting) {
      this.user.skills.splice(this.index, 1)
    }
    else if (this.iseducationediting) {
      this.user.educations.splice(this.index, 1)
    }
    else if (this.isjobediting) {
      this.user.jobhistories.splice(this.index, 1)
    }
    this.save();
  }
  save() {
    this.userService.editUser(this.user).subscribe(
      res => {
        this.toast.setMessage('account settings saved!', 'success')
        this.reload();
      },
      error => console.log(error)
    );
  }

}
