import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from '../subject';

@Injectable()
export class SubjectService {
    private urlGetSubjects = 'Subject/getRecords';
    private urlAddSubject = 'Subject/insertData';
    private urlEditSubject = 'Subject/update';
    private urlDeleteSubject = 'Subject/del';
    private urlGetSearchedSubjects = 'Subject/getRecordsBySearch';
    private urlGetSubjectsRange = 'Subject/getRecordsRange/';
    private urlCountSubjects = 'Subject/countRecords';

    constructor(private http: HttpClient) {
    }

    getSubjectsRange(limit, offset): Observable<Subject[]> {
        return this.http.get<Subject[]>(`${this.urlGetSubjectsRange}${limit}/${offset}`);
    }

    countSubjects() {
        return this.http.get(this.urlCountSubjects);
    }

    getSubjectById(id: number): Observable<Subject[]> {
        return this.http.get<Subject[]>(this.urlGetSubjects + '/' + id);
    }

    addSubject(title: string, description: string): Observable<Subject[]> {
        const body = {subject_name: title, subject_description: description};
        return this.http.post<Subject[]>(this.urlAddSubject, body);
    }

    editSubject(id: number,
                title: string,
                description: string): Observable<Subject[]> {
        const body = {subject_name: title, subject_description: description};
        return this.http.post<Subject[]>(this.urlEditSubject + '/' + id, body);
    }

    deleteSubject(id: number): Observable<Subject[]> {
        return this.http.get<Subject[]>(this.urlDeleteSubject + '/' + id);
    }

    getSearchedSubjects(searchString) {
        return this.http.get<Subject[]>(this.urlGetSearchedSubjects + '/' + searchString);
    }
}
