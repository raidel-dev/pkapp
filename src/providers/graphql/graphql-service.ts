import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { FetchResult } from 'apollo-link';

import { environment } from '../../environments/environment';
import { Alert } from '../../shared/models/alert/alert';
import { Page } from '../../shared/models/app-state/page';
import { ContractLocation } from '../../shared/models/contract-location/contract-location';
import { Contract } from '../../shared/models/contract/contract';
import { Customer } from '../../shared/models/customer/customer';
import { Entity } from '../../shared/models/entity/entity';
import { Feedback } from '../../shared/models/feedback/feedback';
import { RfqSession } from '../../shared/models/rfq-session/rfq-session';
import { Ticket } from '../../shared/models/ticket/ticket';
import { User } from '../../shared/models/user/user';
import * as mutations from './graphql.mutations';
import * as queries from './graphql.queries';
import {
  AddEditLocationPageData,
  AddStripeCardResponse,
  AuctionCreateContractPageData,
  AuctionCreateContractUserData,
  AuctionInProgressContractPageData,
  AuctionInProgressPageData,
  AuctionPageData,
  AvailableSuppliersData,
  BillingInfoPageData,
  ContractDetailPageData,
  ContractHistoriesPageData,
  ContractReviewFeedbackPageData,
  CreateContractLocationResponse,
  CreateContractResponse,
  CreateEntityResponse,
  CreateFeedbackResponse,
  CreateStripeCustomerResponse,
  CreateTicketResponse,
  CreateUserResponse,
  CreateRfqSessionResponse,
  DocumentData,
  EmailSupportPageData,
  EntityDetailPageData,
  FeedbackPageData,
  ForgotUsernameData,
  HomePageData,
  NewContractPageData,
  ProfilePageData,
  RegistrationPageData,
  RiskTolerancePageData,
  SendErrorReportData,
  SendSMSData,
  StripeChargeResponse,
  StripeCustomerData,
  UpdateAlertResponse,
  UpdateContractLocationResponse,
  UpdateContractResponse,
  UpdateCustomerResponse,
  UpdateEntityResponse,
  UpdateRfqSessionResponse,
  UpdateUserResponse,
  UserData,
  UtilityData,
  ZipCodeData,
  RefreshData,
  AuthenticateUserData,
  UpdateTicketResponse,
  CreateTicketCommentResponse,
  TicketData,
  ExtendRfqSessionResponse,
} from './responses';
import { TicketComment } from '../../shared/models/ticket-comments/ticket-comment';

@Injectable()
export class GraphqlServiceProvider {

  private dataCache: {[key in Page]: Promise<any>} = { } as any;

  constructor(private apollo: Apollo) { }

  public reset(page: Page): void {
    if (this.dataCache[page]) {
      this.dataCache[page] = null;
    }
  }

  public resetAll(): void {
    this.dataCache = { } as any;
  }

  public getTicketData(ticketID: number): Promise<ApolloQueryResult<TicketData>> {
    return this.apollo.query<TicketData>({
      query: queries.getTicketData,
      variables: { ticketID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getFeedbackData(userID: string): Promise<ApolloQueryResult<FeedbackPageData>> {
    return this.apollo.query<FeedbackPageData>({
      query: queries.getFeedbackPageData,
      variables: {
        criteria: {
          userID,
          appID: 4
        }
      },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getContractReviewFeedbackData(userID: string): Promise<ApolloQueryResult<ContractReviewFeedbackPageData>> {
    return this.apollo.query<ContractReviewFeedbackPageData>({
      query: queries.getContractReviewFeedbackPageData,
      variables: { userID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getHomeData(userID: string): Promise<ApolloQueryResult<HomePageData>> {
    if (!this.dataCache[Page.Home]) {
      this.dataCache[Page.Home] = this.apollo.query<HomePageData>({
        query: queries.getHomePageData,
        variables: { userID },
        fetchPolicy: 'no-cache'
      }).toPromise();
    }

    return this.dataCache[Page.Home];
  }

  public checkUser(userID: string): Promise<ApolloQueryResult<UserData>> {
    return this.apollo.query<UserData>({
      query: queries.checkUser,
      variables: { userID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getUser(userID: string): Promise<ApolloQueryResult<UserData>> {
    return this.apollo.query<UserData>({
      query: queries.getUser,
      variables: { userID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public authenticateUser(username: string, password: string, role: string): Promise<ApolloQueryResult<AuthenticateUserData>> {
    return this.apollo.query<AuthenticateUserData>({
      query: queries.authenticateUser,
      variables: { username, password, role },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getAuctionCreateContractUserData(userID: string): Promise<ApolloQueryResult<AuctionCreateContractUserData>> {
    return this.apollo.query<AuctionCreateContractUserData>({
      query: queries.getAuctionCreateContractUserData,
      variables: { userID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getAuctionCreateContractData(contractID: string): Promise<ApolloQueryResult<AuctionCreateContractPageData>> {
    return this.apollo.query<AuctionCreateContractPageData>({
      query: queries.getAuctionCreateContractPageData,
      variables: { contractID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getContractDocuments(serviceTypeID: string, supplierID: string, stateID: string,
    utilityID: string, usage: number, status: number): Promise<ApolloQueryResult<DocumentData>> {
    return this.apollo.query<DocumentData>({
      query: queries.getContractDocuments,
      variables: {
        criteria: {
          serviceTypeID,
          supplierID,
          stateID,
          utilityID,
          usage,
          status,
          name: '%contract%',
          attachmentTypeID: environment.contractAttachmentType
        }
      },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public forgotPassword(username: string, email: string): Promise<ApolloQueryResult<ForgotUsernameData>> {
    return this.apollo.query<ForgotUsernameData>({
      query: queries.forgotPassword,
      variables: { username, email },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getUserRiskToleranceData(userID: string): Promise<ApolloQueryResult<RiskTolerancePageData>> {
    return this.apollo.query<RiskTolerancePageData>({
      query: queries.getUserRiskTolerancePageData,
      variables: { userID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getRiskToleranceData(): Promise<ApolloQueryResult<RiskTolerancePageData>> {
    return this.apollo.query<RiskTolerancePageData>({
      query: queries.getRiskTolerancePageData,
      variables: { },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getBillingData(userID: string): Promise<ApolloQueryResult<UserData>> {
    return this.apollo.query<UserData>({
      query: queries.getBillingPageData,
      variables: { userID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getContractHistories(contract: Contract): Promise<ApolloQueryResult<ContractHistoriesPageData>> {
    return this.apollo.query<ContractHistoriesPageData>({
      query: queries.getContractHistoriesPageData,
      variables: {
        contractNum: contract.contractNum,
        customerID: contract.customerID
      },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getProfileData(userID: string): Promise<ApolloQueryResult<ProfilePageData>> {
    if (!this.dataCache[Page.ProfilePage]) {
      this.dataCache[Page.ProfilePage] = this.apollo.query<ProfilePageData>({
        query: queries.getProfilePageData,
        variables: { userID },
        fetchPolicy: 'no-cache'
      }).toPromise();
    }

    return this.dataCache[Page.ProfilePage];
  }

  public getNewEntityExistingContractData(userID: string): Promise<ApolloQueryResult<UserData>> {
    return this.apollo.query<UserData>({
      query: queries.getNewEntityExistingContractData,
      variables: { userID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getStripeCustomerData(stripeCustomerID: string): Promise<ApolloQueryResult<StripeCustomerData>> {
    return this.apollo.query<StripeCustomerData>({
      query: queries.getStripeCustomerData,
      variables: { stripeCustomerID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getBillingInfoData(): Promise<ApolloQueryResult<BillingInfoPageData>> {
    return this.apollo.query<BillingInfoPageData>({
      query: queries.getBillingInfoPageData,
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getEmailSupportData(): Promise<ApolloQueryResult<EmailSupportPageData>> {
    return this.apollo.query<EmailSupportPageData>({
      query: queries.getEmailSupportPageData,
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getRegistrationData(): Promise<ApolloQueryResult<RegistrationPageData>> {
    return this.apollo.query<RegistrationPageData>({
      query: queries.getRegistrationPageData,
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public sendSMS(body: string): Promise<ApolloQueryResult<SendSMSData>> {
    const phoneNumber = environment.callRequestPhone;
    return this.apollo.query<SendSMSData>({
      query: queries.sendSMS,
      variables: { phoneNumber, body },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public sendErrorReport(message: string, report: any): Promise<ApolloQueryResult<SendErrorReportData>> {
    return this.apollo.query<SendErrorReportData>({
      query: queries.sendErrorReport,
      variables: { message, report: JSON.stringify(report) },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getEntitiesData(userID: string): Promise<ApolloQueryResult<UserData>> {
    if (!this.dataCache[Page.Entity]) {
      this.dataCache[Page.Entity] = this.apollo.query<UserData>({
        query: queries.getEntitiesPageData,
        variables: { userID },
        fetchPolicy: 'no-cache'
      }).toPromise();
    }

    return this.dataCache[Page.Entity];
  }

  public getEntityDetailData(id: number): Promise<ApolloQueryResult<EntityDetailPageData>> {
    return this.apollo.query<EntityDetailPageData>({
      query: queries.getEntityDetailPageData,
      variables: { id },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getAuctionData(userID: string, serviceTypeID: string, stateID: string): Promise<ApolloQueryResult<AuctionPageData>> {
    return this.apollo.query<AuctionPageData>({
      query: queries.getAuctionPageData,
      variables: { userID, serviceTypeID, stateID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getAuctionInProgressContractData(contractID: string): Promise<ApolloQueryResult<AuctionInProgressContractPageData>> {
    return this.apollo.query<AuctionInProgressContractPageData>({
      query: queries.getAuctionInProgressContractPageData,
      variables: { contractID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getAuctionInProgressData(contract: Contract): Promise<ApolloQueryResult<AuctionInProgressPageData>> {
    return this.apollo.query<AuctionInProgressPageData>({
      query: queries.getAuctionInProgressPageData,
      variables: {
        contractID: contract.contractID,
        rateCriteria: {
          serviceTypeID: contract.serviceTypeID,
          utilityID: contract.getUtilityID(),
          zipCode: contract.getZipCode(),
          stateID: contract.stateID,
          rateClass: contract.getRateClass(),
          usage: contract.getAnnualUsage(),
          zone: contract.getZone(),
          effectiveDate: contract.getEffectiveDateSmall(),
          baseRate: contract.getBaseRate()
        }
      },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getNewContractPageData(userID: string): Promise<ApolloQueryResult<NewContractPageData>> {
    return this.apollo.query<NewContractPageData>({
      query: queries.getNewContractPageData,
      variables: { userID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getAvailableSuppliers(serviceTypeID: string, stateID: string): Promise<ApolloQueryResult<AvailableSuppliersData>> {
    return this.apollo.query<AvailableSuppliersData>({
      query: queries.getAvailableSuppliers,
      variables: { serviceTypeID, stateID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getContractDetailData(userID: string, contractID: string): Promise<ApolloQueryResult<ContractDetailPageData>> {
    return this.apollo.query<ContractDetailPageData>({
      query: queries.getContractDetailData,
      variables: { userID, contractID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getUserQuestionAnswers(userID: string): Promise<ApolloQueryResult<UserData>> {
    return this.apollo.query<UserData>({
      query: queries.getUserQuestionAnswersData,
      variables: { userID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getPreloadedContractData(userID: string): Promise<ApolloQueryResult<UserData>> {
    return this.apollo.query<UserData>({
      query: queries.getPreloadedContractData,
      variables: { userID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getUtilitiesWithProperties(stateID: string, serviceTypeID: string): Promise<ApolloQueryResult<UtilityData>> {
    return this.apollo.query<UtilityData>({
      query: queries.getUtilitiesWithProperties,
      variables: { stateID, serviceTypeID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getZipCodeWithDefaultUtilities(zipCode: string, serviceTypeID: string): Promise<ApolloQueryResult<ZipCodeData>> {
    return this.apollo.query<ZipCodeData>({
      query: queries.getZipCodeWithDefaultUtilities,
      variables: { zipCode, serviceTypeID },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getAddEditLocationData(): Promise<ApolloQueryResult<AddEditLocationPageData>> {
    return this.apollo.query<AddEditLocationPageData>({
      query: queries.getAddEditLocationPageData,
      variables: { },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public getZipCode(zipCode: string): Promise<ApolloQueryResult<ZipCodeData>> {
    return this.apollo.query<ZipCodeData>({
      query: queries.getZipCode,
      variables: { zipCode },
      fetchPolicy: 'no-cache'
    }).toPromise();
  }

  public createRfqSession(rfqSession: RfqSession): Promise<FetchResult<CreateRfqSessionResponse>> {
    return this.apollo.mutate<CreateRfqSessionResponse>({
      mutation: mutations.createRfqSession,
      variables: { rfqSession }
    }).toPromise();
  }

  public createContract(contract: Contract): Promise<FetchResult<CreateContractResponse>> {
    return this.apollo.mutate<CreateContractResponse>({
      mutation: mutations.createContract,
      variables: { contract }
    }).toPromise();
  }

  public updateTicket(id: number, ticket: Ticket): Promise<FetchResult<UpdateTicketResponse>> {
    return this.apollo.mutate<UpdateTicketResponse>({
      mutation: mutations.updateTicket,
      variables: { id, ticket }
    }).toPromise();
  }

  public updateAlert(id: number, alert: Alert): Promise<FetchResult<UpdateAlertResponse>> {
    return this.apollo.mutate<UpdateAlertResponse>({
      mutation: mutations.updateAlert,
      variables: { id, alert }
    }).toPromise();
  }

  public createEntity(entity: Entity): Promise<FetchResult<CreateEntityResponse>> {
    return this.apollo.mutate<CreateEntityResponse>({
      mutation: mutations.createEntity,
      variables: { entity }
    }).toPromise();
  }

  public updateEntity(id: string, entity: Entity): Promise<FetchResult<UpdateEntityResponse>> {
    return this.apollo.mutate<UpdateEntityResponse>({
      mutation: mutations.updateEntity,
      variables: { id, entity }
    }).toPromise();
  }

  public addCustomerCard(stripeCustomerID: string, sourceToken: string): Promise<FetchResult<AddStripeCardResponse>> {
    return this.apollo.mutate<AddStripeCardResponse>({
      mutation: mutations.addCustomerCard,
      variables: { stripeCustomerID, sourceToken }
    }).toPromise();
  }

  public createStripeCustomer(email: string, name: string): Promise<FetchResult<CreateStripeCustomerResponse>> {
    return this.apollo.mutate<CreateStripeCustomerResponse>({
      mutation: mutations.createStripeCustomer,
      variables: { email, name }
    }).toPromise();
  }

  public createUser(user: User): Promise<FetchResult<CreateUserResponse>> {
    return this.apollo.mutate<CreateUserResponse>({
      mutation: mutations.createUser,
      variables: { user }
    }).toPromise();
  }

  public updateUser(id: string, user: User): Promise<FetchResult<UpdateUserResponse>> {
    return this.apollo.mutate<UpdateUserResponse>({
      mutation: mutations.updateUser,
      variables: { id, user }
    }).toPromise();
  }

  public updateCustomer(id: string, customer: Customer): Promise<FetchResult<UpdateCustomerResponse>> {
    return this.apollo.mutate<UpdateCustomerResponse>({
      mutation: mutations.updateCustomer,
      variables: { id, customer }
    }).toPromise();
  }

  public updateContract(id: string, contract: Contract): Promise<FetchResult<UpdateContractResponse>> {
    return this.apollo.mutate<UpdateContractResponse>({
      mutation: mutations.updateContract,
      variables: { id, contract }
    }).toPromise();
  }

  public createTicket(ticket: Ticket): Promise<FetchResult<CreateTicketResponse>> {
    return this.apollo.mutate<CreateTicketResponse>({
      mutation: mutations.createTicket,
      variables: { ticket }
    }).toPromise();
  }

  public createContractLocation(contractLocation: ContractLocation): Promise<FetchResult<CreateContractLocationResponse>> {
    return this.apollo.mutate<CreateContractLocationResponse>({
      mutation: mutations.createContractLocation,
      variables: { contractLocation }
    }).toPromise();
  }

  public updateContractLocation(contractLocationID: string, contractLocation: ContractLocation): Promise<FetchResult<UpdateContractLocationResponse>> {
    return this.apollo.mutate<UpdateContractLocationResponse>({
      mutation: mutations.updateContractLocation,
      variables: { contractLocationID, contractLocation }
    }).toPromise();
  }

  public updateRfqSession(id: string, rfqSession: RfqSession): Promise<FetchResult<UpdateRfqSessionResponse>> {
    return this.apollo.mutate<UpdateRfqSessionResponse>({
      mutation: mutations.updateRfqSession,
      variables: { id, rfqSession }
    }).toPromise();
  }

  public extendRfqSession(id: string, rfqSession: RfqSession): Promise<FetchResult<ExtendRfqSessionResponse>> {
    return this.apollo.mutate<ExtendRfqSessionResponse>({
      mutation: mutations.extendRfqSession,
      variables: { id, rfqSession }
    }).toPromise();
  }

  public createFeedback(feedback: Feedback): Promise<FetchResult<CreateFeedbackResponse>> {
    return this.apollo.mutate<CreateFeedbackResponse>({
      mutation: mutations.createFeedback,
      variables: { feedback }
    }).toPromise();
  }

  public chargeCustomer(stripeCustomerID: string, amount: number, chargeDescription: string, existingSourceID: string): Promise<FetchResult<StripeChargeResponse>> {
    return this.apollo.mutate<StripeChargeResponse>({
      mutation: mutations.chargeCustomer,
      variables: { stripeCustomerID, amount, chargeDescription, existingSourceID }
    }).toPromise();
  }

  public revokeToken(): Promise<FetchResult<string>> {
    return this.apollo.mutate<string>({
      mutation: mutations.revokeToken
    }).toPromise();
  }

  public refreshToken(): Promise<FetchResult<RefreshData>> {
    return this.apollo.mutate<RefreshData>({
      mutation: mutations.refreshToken
    }).toPromise();
  }

  public createTicketComment(ticketComment: TicketComment): Promise<FetchResult<CreateTicketCommentResponse>> {
    return this.apollo.mutate<CreateTicketCommentResponse>({
      mutation: mutations.createTicketComment,
      variables: { ticketComment }
    }).toPromise();
  }
}
