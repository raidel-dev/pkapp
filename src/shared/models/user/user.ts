import { State } from "../state/state";
import { QuestionAnswer } from "../question-answer/question-answer";
import { Entity } from "../entity/entity";
import { Contract } from "../contract/contract";
import { UserDefaultProduct } from "../user-default-product/user-default-product";
import { Feedback } from "../feedback/feedback";
import { StripeCard, StripeCardsWrapper } from "../stripe/stripe-card";

export class User {
  constructor(user?: User) {
    Object.assign(this, user);
  }

  public userID: string;
  public fname: string;
  public lname: string;
  public username: string;
  public email: string;
  public password: string;
  public confirmpassword: string;
  public initials: string;
  public autoRenewContracts: boolean;
  public subscribeToMobileNotifications: boolean;
  public phone: string;
  public phone2: string;
  public roleID: string;
  public isActive: boolean;
  public billingAddress1: string;
  public billingAddress2: string;
  public billingCity: string;
  public billingZipCode: string;
  public billingStateID: string;
  public stripeCustomerID: string;
  public signature: string;
  public isPasswordExpired: boolean;
  public title: string;
  public DBAName: string;

  public billingState: State;
  public questionAnswers: QuestionAnswer[];
  public entities: Entity[];
  public contracts: Contract[];
  public defaultProducts: UserDefaultProduct[];
  public feedbacks: Feedback[];
  public customerCards: StripeCardsWrapper;
}
