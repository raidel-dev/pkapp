import { AuctionPage } from '../../../pages/auction/auction';
import { AuctionCreateContractPage } from '../../../pages/auction/auction-create-contract/auction-create-contract';
import { AuctionExtendPage } from '../../../pages/auction/auction-in-progress/auction-extend/auction-extend';
import { AuctionInProgressPage } from '../../../pages/auction/auction-in-progress/auction-in-progress';
import { BillingDetailPage } from '../../../pages/tabs/billing/billing-detail/billing-detail';
import { NewContractPage } from '../../../pages/tabs/entities/new-contract/new-contract';
import {
  ReviewContractPage,
} from '../../../pages/tabs/profile/feedback/contracts-review-feedback/review-contract/review-contract';
import { EmailSupportPage } from '../../../pages/tabs/profile/help-center/email-support/email-support';
import { AlertType } from '../alert-type/alert-type';
import { Contract } from '../contract/contract';
import { ActionLink } from '../navigation/action-link';
import { User } from '../user/user';
import { Constants } from '../../constants';
import { Ticket } from '../ticket/ticket';
import { PkSupportIssuePage } from '../../../pages/tabs/profile/help-center/pk-support-issue/pk-support-issue';

export class Alert {
  constructor(alert: Alert) {
    Object.assign(this, alert);

    this.contract = this.contract ? new Contract(this.contract) : this.contract;
    this.ticket = this.ticket ? new Ticket(this.ticket) : this.ticket;
  }

  public id: number;
  public modifiedDate: Date;
  public isRead: boolean;
  public addDate: Date;
  public contractID: string;
  public foldedMessage: string;
  public unfoldedMessage: string;
  public expirationDate: Date;
  public alertTypeID: number;
  public ticketID: number;
  public isOpened: boolean;

  public contract: Contract;
  public alertType: AlertType;
  public ticket: Ticket;

  public isFirstAlert(): boolean {
    return this.foldedMessage && this.foldedMessage.indexOf('This is your first alert') !== -1;
  }

  public getFriendlyAlertType(): string {
    if (!this.alertType) return '';

    return this.alertType.name.replace(/-/g, ' ');
  }

  public isVerySmallHeight(): boolean {
    if (!this.alertType) return false;
    switch(this.alertType.name) {
      case 'contract-ready': {
        return true;
      }
      default: {
        return false;
      }
    }
  }

  public isSmallHeight(): boolean {
    if (!this.alertType) return false;
    switch(this.alertType.name) {
      case 'ticket-new': {
        return true;
      }
      case 'ticket-new-comment': {
        return true;
      }
      case 'contract-rejected': {
        return true;
      }
      case 'contract-dropped': {
        return true;
      }
      case 'competitive-bid': {
        return false;
      }
      case 'market-drop': {
        return false;
      }
      case 'contract-expiring': {
        return false;
      }
      case 'auction-has-completed': {
        return true;
      }
      case 'auction-has-expired': {
        return true;
      }
      case 'invoice-due': {
        return false;
      }
      case 'system-update': {
        return true;
      }
      case 'auction-has-started': {
        return true;
      }
      case 'contract-ready': {
        return true;
      }
      case 'contract-to-review': {
        return true;
      }
      default: {
        return false;
      }
    }
  }

  public getUnfoldedHeight(): string {
    return this.isSmallHeight()
      ? this.isVerySmallHeight() ? '40px' : '60px'
      : '90px';
  }

  public getFoldedHeight(): string {
    return this.isSmallHeight()
    ? this.isVerySmallHeight() ? '80px' : '100px'
    : '130px';
  }

  public hasAction(): boolean {
    switch(this.alertType.name) {
      case 'ticket-new':
      case 'ticket-new-comment':
      case 'contract-rejected':
      case 'contract-dropped':
      case 'competitive-bid':
      case 'auction-has-completed':
      case 'auction-has-started':
      case 'contract-expiring':
      case 'auction-has-expired':
      case 'invoice-due':
      case 'contract-ready':
      case 'market-drop':
      case 'contract-to-review': {
        return true;
      }
      case 'system-update': {
        return this.isFirstAlert();
      }
      default: {
        return false;
      }
    }
  }

  public actionText(): string {
    switch(this.alertType.name) {
      case 'ticket-new':
      case 'ticket-new-comment': {
        return 'Respond';
      }
      case 'contract-rejected':
      case 'contract-dropped': {
        return 'I Have More Questions';
      }
      case 'competitive-bid': {
        return 'Start Your Auction';
      }
      case 'auction-has-completed': {
        return 'Review Bids';
      }
      case 'contract-expiring': {
        return 'Start Your Auction';
      }
      case 'auction-has-expired': {
        return 'Refresh Bids';
      }
      case 'auction-has-started': {
        return 'Review Bids';
      }
      case 'invoice-due': {
        return 'Manage Bills';
      }
      case 'market-drop': {
        return 'Start Your Auction';
      }
      case 'system-update': {
        return this.isFirstAlert() ? 'View Your Profile' : '';
      }
      case 'contract-ready': {
        return 'Review Contract';
      }
      case 'contract-to-review': {
        return 'Review My Contract';
      }
      default: {
        return '';
      }
    }
  }

  public actionIsRoot(): boolean {
    switch(this.alertType.name) {
      case 'system-update': {
        return this.isFirstAlert() ? true : false;
      }
      default: {
        return false;
      }
    }
  }

  public actionLink(user: User): ActionLink {
    switch(this.alertType.name) {
      case 'ticket-new':
      case 'ticket-new-comment': {
        return { page: PkSupportIssuePage, params: { ticket: this.ticket, user } };
      }
      case 'contract-rejected':
      case 'contract-dropped': {
        return { page: EmailSupportPage, params: {
          user,
          subject: `Follow up on ${this.contract.customer.DBAName}`,
          category: Constants.ticketCategories.dropped
        } };
      }
      case 'competitive-bid': {
        return { page: NewContractPage };
      }
      case 'market-drop': {
        return { page: AuctionPage, params: { contract: this.contract, isRenewal: true } };
      }
      case 'contract-expiring': {
        return { page: AuctionPage, params: { contract: this.contract, isRenewal: true } };
      }
      case 'auction-has-completed': {
        return { page: AuctionInProgressPage, params: { contractID: this.contract.contractID } };
      }
      case 'auction-has-started': {
        return { page: AuctionInProgressPage, params: { contractID: this.contract.contractID } };
      }
      case 'auction-has-expired': {
        return { page: AuctionExtendPage, params: { rfqSession: this.contract.rfqSession } };
      }
      case 'invoice-due': {
        return { page: BillingDetailPage, params: { contract: this.contract } };
      }
      case 'system-update': {
        return this.isFirstAlert()
          ? { tabIndex: 3 } : null;
      }
      case 'contract-ready': {
        return { page: AuctionCreateContractPage, params: { contractID: this.contract.contractID } };
      }
      case 'contract-to-review': {
        return { page: ReviewContractPage, params: { contract: this.contract }};
      }
      default: {
        return null;
      }
    }
  }

  public getClass(): string {
    switch(this.alertType.name) {
      case 'ticket-new-comment': {
        return 'button-info';
      }
      case 'contract-rejected': {
        return 'button-danger';
      }
      case 'contract-dropped': {
        return 'button-danger';
      }
      case 'competitive-bid': {
        return 'button-danger';
      }
      case 'market-drop': {
        return 'button-info';
      }
      case 'contract-expiring': {
        return 'button-danger';
      }
      case 'auction-has-completed': {
        return 'button-warning';
      }
      case 'auction-has-expired': {
        return 'button-warning';
      }
      case 'invoice-due': {
        return 'button-danger';
      }
      case 'system-update': {
        return 'button-info';
      }
      case 'auction-has-started': {
        return 'button-info';
      }
      case 'contract-ready': {
        return 'button-info';
      }
      case 'contract-to-review': {
        return 'button-info';
      }
      default: {
        return null;
      }
    }
  }
}