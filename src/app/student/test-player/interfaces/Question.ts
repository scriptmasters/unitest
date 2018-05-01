export interface IQuestion {
  question_id: number;
  question_text: string;
  test_id?: number;
  level?: number;
  type?: number;
}
