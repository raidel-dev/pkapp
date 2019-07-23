import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../../providers/graphql/graphql-service';
import { Contract } from '../../../shared/models/contract/contract';
import { Entity } from '../../../shared/models/entity/entity';
import { BillingDetailPage } from './billing-detail/billing-detail';
import { BillingEntityInvoicesPage } from './billing-entity-invoices/billing-entity-invoices';
import { ApolloError } from 'apollo-client';

@IonicPage()
@Component({
  selector: 'page-billing',
  templateUrl: 'billing.html',
})
export class BillingPage {
  public entities: Entity[];
  public individualContracts: Contract[];
  
  public loading = true;

  constructor(public navCtrl: NavController,
    private authService: AuthServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    public navParams: NavParams) {
      this.authService.getAuthFields()
        .then(authFields => {
          if (authFields) {
            this.graphQLService.getBillingData(authFields.userID)
              .then(result => {
                this.entities = result.data.user.entities.map(d => new Entity(d));
                this.individualContracts = result.data.user.contracts
                  .map(c => new Contract(c))
                  .filter(c => !c.renewalID);

                this.loading = false;
              })
              .catch((res: ApolloError) => {
                this.loading = false;
              });
          }
        });
  }
  
  goBillingEntityInvoices(entity: Entity): void {
    this.navCtrl.push(BillingEntityInvoicesPage, { entity });
  }

  goContractBillingDetail(contract: Contract): void {
    this.navCtrl.push(BillingDetailPage, { contract });
  }
}
