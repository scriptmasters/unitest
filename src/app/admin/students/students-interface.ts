export interface StudentGet {
    user_id: string;
    gradebook_id: string;
    student_surname: string;
    student_name: string;
    student_fname: string;
    group_id: string;
    plain_password: string;
    photo: string;
}

export interface StudentAdd {
    gradebook_id: string;
    student_surname: string;
    student_name: string;
    student_fname: string;
    group_id: string;
    password: string;
    password_confirm: string;
    plain_password: string;
    username: string;
    email: string;
    photo: string;
}

export interface GroupNameByID {
    group_id: string;
    group_name: string;
    speciality_id: string;
    faculty_id: string;
}

export interface Student {
    student_surname: string;
    student_name: string;
    student_fname: string;
    gradebook_id: string;
    group: string;
}
