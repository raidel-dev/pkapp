import { TicketComment } from "../ticket-comments/ticket-comment";

export class Ticket {
  constructor(ticket?: Ticket) {
    Object.assign(this, ticket);

    this.addDate = this.addDate ? new Date(this.addDate) : this.addDate;
    this.comments = this.comments ? this.comments.map(c => new TicketComment(c)) : this.comments;
  }

  public id: number;
  public subject: string;
  public body: string;
  public email: string;
  public userID: string;
  public ticketCategoryID: number;
  public priority: number;
  public isComplete: boolean;
  public addDate: Date;

  public comments: TicketComment[];
}