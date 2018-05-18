export interface IQuestion {
    question_id: string;
    test_id: string;
    question_text: string;
    level: string;
    type: string;
    attachment: string;
}

export interface IAnswerSet {
    question_id: string;
    true_answer: string;
    answer_text: string;
    attachment: string;
  }

export interface IAnswer {
    answer_id: string;
    question_id: string;
    true_answer: string;
    answer_text: string;
    attachment: string;
  }

export interface IResponse {
    response: string;
}


export interface ISubjectsGet {
    subject_id: string;
    subject_name: string;
    subject_description: string;
}

export interface ITestsGet {
    test_id: string;
    test_name: string;
    subject_id: string;
    tasks: string;
    time_for_test: string;
    enabled: string;
    attempts: string;
}
