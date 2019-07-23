export class QuestionAnswer {
  constructor(questionAnswer?: QuestionAnswer) {
    Object.assign(this, questionAnswer);
  }

  public id: number;
  public questionID: number;
  public answer: string;
  public isActive: string;
}