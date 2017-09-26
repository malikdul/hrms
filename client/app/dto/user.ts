
export class UserDto {
    pinfo: PersonInfo;
    skills: Array<Skill>;
    educations: Array<Education>;
    jobhistories: Array<JobHistory>;
    documents: Array<Document>;

}

export class PersonInfo {
    username: String;
    email: String;
    password: String
    role: String;
    status: Boolean;
    verify: Boolean;
    deleted: Boolean;
    phoneno: String;
    address: String;
    dob: String;

}
export class Skill {
    name: String;
    experience: Number
}

export class Education {
    degreename: String;
    subject: String;
    institution: String;
    completionyear: String;
    percentage: String;
}
export class JobHistory {
    orgname: String;
    desg: String;
    dur: String;
}
export class Document {
    path: String;
    name: String;
    type: String;
}
