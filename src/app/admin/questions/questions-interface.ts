export interface IQuestions {
    question_id: string;
    test_id: string;
    test: string;
    question_text: string;
    level: string;
    type: string;
    attachment: string;

}


export interface IQuestionsGet {
    question_id: string;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    attachment: string;
}

export interface IQuestionAdd {
    test_id: string;
    question_text: string;
    level: string;
    type_name: string;
    type_index: string;
    attachment: string;
}

export interface ITestNameByID { // адаптувати відповідно до сутності Question
    test_id: string;
    test_name: string;
    subject_id: string;
    faculty_id: string;

//    Test: {test_id, test_name, subject_id, tasks, time_for_test, enabled, attempts}
//    TestDetail: {id, test_id, level, tasks, rate}
}

export interface IResponse {
    response: string;
}
