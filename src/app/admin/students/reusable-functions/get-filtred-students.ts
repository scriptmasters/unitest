import IStudent from '../interfaces/IStudent';
import IGroup from '../interfaces/IGroup';

export function getFiltredStudents(students: IStudent[], groups: IGroup[]): IStudent[] {
    return students.map(student => {
        const eachStudent: IStudent = {
            student_fname: student.student_fname,
            student_name: `${student.student_name} `,
            student_surname: `${student.student_surname} `,
            fullName: `${student.student_surname} ${student.student_name} ${student.student_fname}`,
            gradebook_id: student.gradebook_id,
            user_id: student.user_id,
            group_id: student.group_id
        };
        // Adding group name to display it at table
        groups.forEach(group => {
            if (eachStudent.group_id === group.group_id) {
                eachStudent.group = group.group_name;
                eachStudent.faculty_id = group.faculty_id;
            }
        });
        return eachStudent;
    });
}
