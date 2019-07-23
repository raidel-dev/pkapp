export class Feedback {
  constructor(feedback?: Feedback) {
    Object.assign(this, feedback);

    if (feedback) {
      this.addDate = new Date(feedback.addDate);
    }
  }

  public id: number;
  public contractID: string;
  public supplierID: string;
  public userID: string;
  public rating: number;
  public body: string;
  public appID: number;
  public addDate: Date;
}