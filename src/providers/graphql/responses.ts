import { Alert } from '../../shared/models/alert/alert';
import { AuthFields } from '../../shared/models/auth/auth-fields';
import { ContractLocation } from '../../shared/models/contract-location/contract-location';
import { Contract } from '../../shared/models/contract/contract';
import { Customer } from '../../shared/models/customer/customer';
import { Document } from '../../shared/models/document/document';
import { Entity } from '../../shared/models/entity/entity';
import { Feedback } from '../../shared/models/feedback/feedback';
import { Product } from '../../shared/models/product/product';
import { Question } from '../../shared/models/question/question';
import { Rate } from '../../shared/models/rate/rate';
import { RfqSession } from '../../shared/models/rfq-session/rfq-session';
import { ServiceType } from '../../shared/models/service-type/service-type';
import { State } from '../../shared/models/state/state';
import { StripeCard, StripeCardsWrapper } from '../../shared/models/stripe/stripe-card';
import { StripeCharge } from '../../shared/models/stripe/stripe-charge';
import { StripeCustomer } from '../../shared/models/stripe/stripe-customer';
import { Supplier } from '../../shared/models/supplier/supplier';
import { TicketCategory } from '../../shared/models/ticket-category/ticket-category';
import { Ticket } from '../../shared/models/ticket/ticket';
import { MessageResource } from '../../shared/models/twilio/message-resource';
import { User } from '../../shared/models/user/user';
import { Utility } from '../../shared/models/utility/utility';
import { ZipCode } from '../../shared/models/zip-code/zip-code';
import { TicketComment } from '../../shared/models/ticket-comments/ticket-comment';

export class PagedData<T> {
  data: T[];
  total: number;
  start: number;
  end: number;
}

export class ForgotUsernameData {
  user: User;
}

export class ForgotPasswordData {
  user: User;
}

export class DocumentData {
  documents: PagedData<Document>;
}

export class AuctionCreateContractUserData {
  user: User;
}

export class AuctionCreateContractPageData {
  contract: Contract;
}

export class SendErrorReportData {
  sendErrorReport: string;
}

export class SendSMSData {
  sendSMS: MessageResource;
}

export class TicketData {
  ticket: Ticket;
}

export class FeedbackPageData {
  feedbacks: PagedData<Feedback>;
}

export class ContractReviewFeedbackPageData {
  user: User;
}

export class HomePageData {
  alerts: PagedData<Alert>;
  user: User;
}

export class BillingPageData {
  entities: PagedData<Entity>;
  contracts: PagedData<Contract>;
}

export class StripeCustomerData {
  customerCards: StripeCardsWrapper;
}

export class BillingInfoPageData {
  states: PagedData<State>;
}

export class AddEditLocationPageData {
  states: PagedData<State>;
}

export class ContractHistoriesPageData {
  contractHistories: PagedData<Contract>;
}

export class ProfilePageData {
  user: User;
}

export class EmailSupportPageData {
  ticketCategories: PagedData<TicketCategory>;
}

export class RegistrationPageData {
  states: PagedData<State>
}

export class AuctionPageData {
  user: User;
  availableSuppliers: PagedData<Supplier>;
  products: PagedData<Product>;
}

export class EntityDetailPageData {
  entity: Entity;
  states: PagedData<State>;
}

export class ContractDetailPageData {
  user: User;
  contract: Contract;
}

export class AvailableSuppliersData {
  availableSuppliers: PagedData<Supplier>;
}

export class AuthenticateUserData {
  authenticateUser: AuthFields;
}

export class RefreshData {
  refreshToken: AuthFields;
}

export class UserData {
  user: User;
}

export class CreateTicketCommentResponse {
  createTicketComment: TicketComment;
}

export class UpdateTicketResponse {
  updateTicket: Ticket;
}

export class UpdateAlertResponse {
  updateAlert: Alert;
}

export class CreateEntityResponse{
  createEntity: Entity;
}

export class AddStripeCardResponse {
  addStripeCard: StripeCard;
}

export class UpdateEntityResponse {
  updateEntity: Entity;
}

export class CreateUserResponse {
  createUser: User;
}

export class CreateStripeCustomerResponse {
  createStripeCustomer: StripeCustomer;
}

export class UpdateUserResponse {
  updateUser: User;
}

export class UpdateCustomerResponse {
  updateCustomer: Customer;
}

export class CreateContractResponse {
  createContract: Contract;
}

export class UpdateContractResponse {
  updateContract: Contract;
}

export class CreateTicketResponse {
  createTicket: Ticket;
}

export class UpdateContractLocationResponse {
  updateContractLocation: ContractLocation;
}

export class UpdateRfqSessionResponse {
  updateRfqSession: RfqSession;
}

export class ExtendRfqSessionResponse {
  extendRfqSession: RfqSession;
}

export class CreateFeedbackResponse {
  createFeedback: Feedback;
}

export class StripeChargeResponse {
  chargeCustomer: StripeCharge;
}

export class CreateRfqSessionResponse {
  createRfqSession: RfqSession;
}

export class UtilityData {
  utilities: PagedData<Utility>;
}

export class CreateContractLocationResponse {
  createContractLocation: ContractLocation;
}

export class ZipCodeData {
  zipCode: ZipCode;
}

export class RiskTolerancePageData {
  user: User;
  questions: PagedData<Question>;
}

export class NewContractPageData {
  user: User;
  serviceTypes: PagedData<ServiceType>;
  states: PagedData<State>;
}

export class AuctionInProgressContractPageData {
  contract: Contract;
}

export class AuctionInProgressPageData {
  rfqSession: RfqSession;
  rates: PagedData<Rate>;
}