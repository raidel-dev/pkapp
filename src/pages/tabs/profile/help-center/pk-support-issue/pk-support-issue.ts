import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, Content, IonicPage, NavController, NavParams, TextInput } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../../../providers/app-state/app-state-service';
import { Ticket } from '../../../../../shared/models/ticket/ticket';
import { User } from '../../../../../shared/models/user/user';
import { AbstractPageForm } from '../../../../../shared/abstract-page-form';
import { TicketComment } from '../../../../../shared/models/ticket-comments/ticket-comment';
import { GraphqlServiceProvider } from '../../../../../providers/graphql/graphql-service';
import { Page } from '../../../../../shared/models/app-state/page';

@IonicPage()
@Component({
  selector: 'page-pk-support-issue',
  templateUrl: 'pk-support-issue.html',
})
export class PkSupportIssuePage extends AbstractPageForm {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  public comments: TicketComment[] = [];
  public user: User;
  public pkSupport: User;
  public message = '';
  public showEmojiPicker = false;
  public ticket: Ticket;
  public gettingTicketData = false;

  private checkTicket: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private graphQLService: GraphqlServiceProvider,
    public appStateService: AppStateServiceProvider,
    private actionSheetCtrl: ActionSheetController) {
    super(appStateService);
    this.user = navParams.data.user;
    this.ticket = navParams.data.ticket;

    if (this.ticket.comments) {
      this.ticket.comments.unshift({
        body: this.ticket.body,
        addDate: this.ticket.addDate,
        userID: this.user.userID
      } as TicketComment);
    }

    this.comments.push(...this.ticket.comments);

    this.checkTicket = setInterval(() => {
      if (!this.gettingTicketData) {
        this.graphQLService.getTicketData(this.ticket.id)
          .then(res => {
            const lastComment = this.comments[this.comments.length - 1];
            const comments = res.data.ticket.comments.map(c => new TicketComment(c))
              .filter(c => !c.isInternal)
              .filter(c => c.addDate.getTime() > lastComment.addDate.getTime());
            if (comments && comments.length) {
              this.graphQLService.reset(Page.Home);
              this.comments.push(...comments);
            }
            this.gettingTicketData = false;
          });
      }
    }, 5000);
  }

  ionViewWillLeave() {
    this.appStateService.setTabHidden(false);
    clearInterval(this.checkTicket);
  }

  public onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  public switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.messageInput.setFocus();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name sendMsg
   */
  public sendMsg() {
    if (!this.message.trim()) return;

    const newMessage = { body: this.message, userID: this.user.userID, isSent: false, isNew: true } as TicketComment;
    this.comments.push(newMessage);
    this.message = '';

    if (!this.showEmojiPicker) {
      this.messageInput.setFocus();
    }
    this.messageInput.setFocus();

    this.graphQLService.createTicketComment({ ticketID: this.ticket.id, body: newMessage.body, isInternal: false } as TicketComment)
      .then(res => {
        if (res) {
          newMessage.addDate = new Date(res.data.createTicketComment.addDate);
          newMessage.isSent = true;
        }
      });
  }

  public scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  public attach() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Camera',
          handler: () => {
          }
        },
        {
          text: 'Photo & Video Library',
          handler: () => {
          }
        },
        {
          text: 'Document',
          handler: () => {
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

}
