export class TicketComment {
  constructor(ticketComment: TicketComment) {
    Object.assign(this, ticketComment);

    this.addDate = this.addDate ? new Date(this.addDate) : this.addDate;
  }

  public id: number;
  public ticketID: number;
  public userID: string;
  public body: string;
  public addDate: Date;
  public isInternal: boolean;

  public isSent: boolean;
  public isNew: boolean;
}