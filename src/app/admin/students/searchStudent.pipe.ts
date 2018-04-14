import { Pipe, PipeTransform } from '@angular/core';
import IStudent from './interfaces/IStudent';

@Pipe({
    name: 'searchStudent'
})
export class SearchStudentPipe implements PipeTransform {
    transform(students: IStudent[], value: string): IStudent[] {
        return students.filter(student => {
            return student.student_name.toLowerCase().includes(value.toLowerCase()) ||
                student.student_fname.toLowerCase().includes(value.toLowerCase()) ||
                student.student_surname.toLowerCase().includes(value.toLowerCase());
        });
    }
}
