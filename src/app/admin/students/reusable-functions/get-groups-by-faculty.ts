import IFaculty from '../interfaces/IFaculty';

export function getGroupsByFaulty(
    elem: HTMLSelectElement,
    updating: boolean,
    faculties: IFaculty[]) {
    const value = elem.options[elem.selectedIndex].value;
    if (updating) {
      if (value === 'Виберіть факультет') {
        return false;
      }
    }
    let index: string;
    // Iterate array to find neccessary faculty id
    faculties.forEach(val => {
      if (val.faculty_name === value) {
        index = val.faculty_id;
      }
    });
    // Request for the available groups
    return index;
}
