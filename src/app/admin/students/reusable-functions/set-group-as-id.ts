import IGroup from '../interfaces/IGroup';

export function setGroupAsID(elem: HTMLSelectElement, groups: IGroup[]) {
    const value = elem.options[elem.selectedIndex].value;
    if (value === 'Виберіть групу') {
      return false;
    }
    let index: string;
    groups.forEach(val => {
      if (val.group_name === value) {
        index = val.group_id;
      }
    });
    return index;
}
