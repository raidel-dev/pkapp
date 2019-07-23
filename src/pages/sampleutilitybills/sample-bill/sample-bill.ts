import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { environment } from '../../../environments/environment';
import { GraphqlServiceProvider } from '../../../providers/graphql/graphql-service';


@IonicPage()
@Component({
  selector: 'page-sample-bill',
  templateUrl: 'sample-bill.html',
})
export class SampleBillPage {

  public sampleBillAttachment: string;
  public loading = true;

  constructor(public navCtrl: NavController,
    private graphQLService: GraphqlServiceProvider,
    public navParams: NavParams) {
    const attachmentID = navParams.data.attachmentID;

    if (attachmentID) {
      // this.graphQLService.getAttachment(attachmentID)
      //   .then(res => {
      //     this.sampleBillAttachment = 
      //   })
      this.sampleBillAttachment = `${environment.resourceEndpoint}/attachment/view/attachmentID/${attachmentID}`;
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

}
