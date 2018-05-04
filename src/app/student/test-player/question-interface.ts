// export interface QuestionInterface {
//     questionId: number;
//     text: string;
//     answers: Array<AnswerInterface>;
//     ready: boolean;
// }
// export interface AnswerInterface {
//     answerId: number;
//     text: string;
// }
// export interface ResultInterface {
//     question_id: number;
//     answer_ids: Array<any>;
// }
export interface UserInfo {
  user_id: number;
  student_fname: string;
  student_name: string;
  student_surname: string;
  group_id: number;
  photo: string;
  group_name: string;
  speciality_id: number;
  faculty_id: number;
  gradebook_id: number;
  speciality_code: number;
  speciality_name: string;
  faculty_name: string;
  ready: boolean;
}
export interface TimeTable {
  end_date: string;
  end_time: string;
  group_id: number;
  start_date: string;
  start_time: string;
  subject_id: number;
  timetable_id: number;
  subject: Array<Subject>;
  ready: boolean;
}
export interface Subject {
  subject_name: string;
  subject_id: number;
  tests: Array<TestInterface>;
  ready: boolean;
  timetable: Array<TimeTable>;
}

export interface TestInterface {
  test_name: string;
  test_id: number;
  tasks: number;
  time_for_test: number;
  enabled: number;
  attempts: number;
}
