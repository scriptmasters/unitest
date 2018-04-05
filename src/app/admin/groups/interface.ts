import { Faculties, Specialities } from './interface';
import { group } from '@angular/core';
export interface Table {
    group_id: number,
    group: string,
    faculty: string,
    speciality: string
}

export interface Groups{
        group_id: string,
        group_name: string,
        speciality_id: string,
        faculty_id: string
}

export interface Faculties{
    faculty_id: string,
    faculty_name: string,
    faculty_description: string
}

export interface Specialities{
    speciality_id: string,
    speciality_code: string,
    speciality_name: string
}

export interface DelGroup{
    response: string;
}
export interface AddGroup{
    group_name: string
    speciality_id: number,
    faculty_id: number,
}