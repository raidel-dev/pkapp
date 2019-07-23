export class StripeCard {
  constructor(card: StripeCard) {
    Object.assign(this, card);
  }

  public exp_month: number;
  public exp_year: number;
  public last4: string;
  public brand: string;
  public id: string;
}

export class StripeCardsWrapper {
  public data: StripeCard[];
  public object: string;
}