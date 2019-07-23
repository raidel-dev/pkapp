export class TicketCategory {
  constructor(ticketCategory: TicketCategory) {
    Object.assign(this, ticketCategory);
  }

  public id: number;
  public name: string;
  public isActive: boolean;
}