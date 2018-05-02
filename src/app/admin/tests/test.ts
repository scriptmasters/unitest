export class Test {
    test_id: number;
    test_name: string;
    subject_id: number;
    tasks: number;
    time_for_test: number;
    enabled: boolean;
    attempts: number;
}

export interface IResponse {
    response: string;
}

export interface Subject {
    subject_id: number;
    subject_name: string;
    subject_description: string;
  }