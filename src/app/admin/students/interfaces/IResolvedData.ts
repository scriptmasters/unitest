import ISudent from './IStudent';
import IStudent from './IStudent';

export default interface IResolvedData {
    students: IStudent[];
    byGroup: boolean;
}
