export interface QuestionInterface {
    questionId: number;
    text: string;
    answers: Array<AnswerInterface>;
    ready: boolean;
}
export interface AnswerInterface {
    answerId: number;
    text: string;
}
export interface ResultInterface {
    question_id: number;
    answer_ids: Array<any>;
}