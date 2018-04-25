import { Pipe, PipeTransform } from '@angular/core';
import IStudent from '../interfaces/IStudent';
import { MatDialog } from '@angular/material';
import { ResponseMessageComponent } from '../../../shared/response-message/response-message.component';

@Pipe({
    name: 'filterByGroup'
})
export class FilterByGroupPipe implements PipeTransform {
    constructor(private dialog: MatDialog) {}
    transform(students: IStudent[], value: string): IStudent[] {
        if (value === 'Виберіть групу') {
            return students;
        }
        const filtredStudents = students.filter(student => student.group.toLowerCase().includes(value.toLowerCase()));
        if (filtredStudents.length < 1) {
            this.dialog.open(ResponseMessageComponent, {
                width: '400px',
                data: {
                    message: 'Немає жодного студента в цій групі :('
                }
            });
            return students;
        }
        return filtredStudents;
    }
}
