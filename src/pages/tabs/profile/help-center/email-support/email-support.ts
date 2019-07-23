import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../../../../providers/graphql/graphql-service';
import { AbstractPageForm } from '../../../../../shared/abstract-page-form';
import { Alert } from '../../../../../shared/models/alert/alert';
import { TicketCategory } from '../../../../../shared/models/ticket-category/ticket-category';
import { Ticket } from '../../../../../shared/models/ticket/ticket';
import { User } from '../../../../../shared/models/user/user';
import { TabsPage } from '../../../tabs';
import { Page } from '../../../../../shared/models/app-state/page';

@IonicPage()
@Component({
  selector: 'page-email-support',
  templateUrl: 'email-support.html',
})
export class EmailSupportPage extends AbstractPageForm {
  public loading = true;
  public isFocusEmail: boolean;
  public isFocusDes: boolean;
  public isFocusSubject: boolean;

  public user: User;
  public preFilledBody: string;
  public preFilledSubject: string;
  public preFilledCategory: number;

  public ticketCategories: TicketCategory[];

  public emailSupportErrorMessage: string;
  public emailSupportForm: FormGroup;
  public startEmailSupportValidation = false;

  public requestButtonEnabled = true;
  public requestButtonText = 'Send';

  constructor(public navCtrl: NavController,
    private altCtrl: AlertController,
    private graphQLService: GraphqlServiceProvider,
    public appStateService: AppStateServiceProvider,
    public navParams: NavParams) {
      super(appStateService);
      this.user = navParams.data.user;

      this.preFilledBody = navParams.data.body;
      this.preFilledSubject = navParams.data.subject;
      this.preFilledCategory = navParams.data.category;

      this.emailSupportForm = new FormGroup({
        email: new FormControl(this.user.email),
        subject: new FormControl(this.preFilledSubject, [Validators.required]),
        body: new FormControl(this.preFilledBody ? this.preFilledBody : '', [Validators.required]),
        ticketCategoryId: new FormControl(this.preFilledCategory, [Validators.required])
      });

      this.graphQLService.getEmailSupportData()
        .then(result => {
          this.ticketCategories = result.data.ticketCategories.data
            .filter(d => d.name !== 'Other')
            .map(t => new TicketCategory(t))
            .concat([new TicketCategory(result.data.ticketCategories.data
              .find(d => d.name === 'Other'))]);
          this.loading = result.loading;
        })
        .catch((res: HttpErrorResponse) => {
          if (res && res.status) {
            this.emailSupportErrorMessage = res.statusText;
          } else {
            this.emailSupportErrorMessage = 'There was a problem getting the page data.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.loading = false;
        });
  }

  get email() { return this.emailSupportForm.get('email'); }
  get subject() { return this.emailSupportForm.get('subject'); }
  get body() { return this.emailSupportForm.get('body'); }
  get ticketCategoryId() { return this.emailSupportForm.get('ticketCategoryId'); }

  ionViewDidLoad() { }

  public isFocus(element: string): void {
    switch (element) {
      case "email":
        this.isFocusEmail = true;
        break;
      case "description":
        this.isFocusDes = true;
        break;
      case "subject":
        this.isFocusSubject = true;
        break;
    }
  }

  public isBlur(element: string): void {
    switch (element) {
      case "email":
        this.isFocusEmail = false;
        break;
      case "description":
        this.isFocusDes = false;
        break;
      case "subject":
        this.isFocusSubject = false;
        break;
    }
  }

  public request() {
    this.startEmailSupportValidation = true;
    this.emailSupportErrorMessage = '';
    this.setTouched(this.emailSupportForm);
    this.requestButtonText = 'Sending...';
    this.requestButtonEnabled = false;

    if (this.emailSupportForm.valid) {
      const ticketDto = this.getTicketDto();
      this.graphQLService.createTicket(ticketDto)
        .then(() => {
          this.graphQLService.reset(Page.Home);
          const alert = this.altCtrl.create({
            title: 'Email Support',
            message: 'Your message has been sent. A response will be sent to your Homescreen Alerts tab within 48 hours', buttons: [
              {
                text: 'Got it',
                handler: () => { }
              }
            ]
          });
          alert.onDidDismiss(() => this.navCtrl.pop());
          alert.present();
          this.requestButtonText = 'Send';
          this.requestButtonEnabled = true;
        })
        .catch((res: HttpErrorResponse) => {
          if (res && res.status) {
            this.emailSupportErrorMessage = res.statusText;
          } else {
            this.emailSupportErrorMessage = 'There was a problem processing your request.  We have been notified about this issue and will resolve it as quickly as we can.  Please try again later.'
          }
          this.requestButtonText = 'Send';
          this.requestButtonEnabled = true;
        });
    } else {
      this.requestButtonText = 'Send';
      this.requestButtonEnabled = true;
    }
  }

  private getTicketDto(): Ticket {
    const ticket = new Ticket();

    ticket.body = this.body.value.trim();
    ticket.subject = this.subject.value.trim();
    ticket.email = this.email.value.trim();
    ticket.userID = this.user.userID;
    ticket.ticketCategoryID = this.ticketCategoryId.value;
    ticket.priority = 1;

    return ticket;
  }
}
