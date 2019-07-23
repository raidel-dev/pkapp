import { QuestionAnswer } from "../question-answer/question-answer";

export class Question {
  constructor(question: Question) {
    Object.assign(this, question);
  }

  public id: number;
  public question: string;
  public type: string;
  public isActive: boolean;

  public answers: QuestionAnswer[];
  public selectedAnswer: QuestionAnswer;
}
