import { Pipe, PipeTransform } from '@angular/core';
import IStudent from './interfaces/IStudent';

@Pipe({
    name: 'searchStudent'
})
export class SearchStudentPipe implements PipeTransform {
    transform(students: IStudent[], value: string): IStudent[] {
        return students.filter(student => student.fullName.toLowerCase().includes(value.toLowerCase()));
    }
}
