export class AlertType {
  constructor(alertType: AlertType) {
    Object.assign(this, alertType);
  }

  public id: number;
  public name: string;
  public description: string;
  public addDate: Date;
  public modifiedDate: Date;
}