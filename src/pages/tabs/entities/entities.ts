import { Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { ActionSheetController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppStateServiceProvider } from '../../../providers/app-state/app-state-service';
import { AuthServiceProvider } from '../../../providers/auth/auth-service';
import { GraphqlServiceProvider } from '../../../providers/graphql/graphql-service';
import { Page } from '../../../shared/models/app-state/page';
import { Contract } from '../../../shared/models/contract/contract';
import { Entity } from '../../../shared/models/entity/entity';
import { ContractDetailPage } from './contract-detail/contract-detail';
import { EntityDetailPage } from './entity-detail/entity-detail';
import { NewContractPage } from './new-contract/new-contract';
import { NewEntityPage } from './new-entity/new-entity';
import { Constants } from '../../../shared/constants';
import { AuctionInProgressPage } from '../../auction/auction-in-progress/auction-in-progress';

@IonicPage()
@Component({
  selector: 'page-entities',
  templateUrl: 'entities.html',
})
export class EntitiesPage {

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  public entities: Entity[];
  public individualContracts: Contract[];
  public loading = true;

  public showEntities = true;
  public showContracts = false;

  public loadingContracts = false;
  public Constants = Constants;

  constructor(private appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    private authService: AuthServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController) { }

  ionViewDidEnter() {
    this.appStateService.setPage(Page.Entity);
    this.tabGroup.realignInkBar();

    this.loading = true;
    this.entities = [];
    this.individualContracts = [];
    this.loadEntitiesAndContracts();
  }

  ionViewDidLoad(): void {
    // hack fix for tab pagination appearing when moving between root tab navs
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 20);
  }

  public loadEntitiesAndContracts(): void {
    this.authService.getAuthFields()
      .then(authFields => {
        if (authFields) {
          this.graphQLService.getEntitiesData(authFields.userID)
            .then(result => {
              this.entities = result.data.user.entities
                .map(e => new Entity(e))
              this.individualContracts = result.data.user.contracts
                .map(c => new Contract(c))
                .filter(c => !c.renewalID);
              this.loading = result.loading;
            });
        }
      });
  }

  public goAuction(contract: Contract): void {
    this.navCtrl.push(AuctionInProgressPage, { contractID: contract.contractID });
  }

  public openEntitiesDetail(entity: Entity) {
    this.navCtrl.push(EntityDetailPage, { entity });
  }

  public toggleTabs(): void {
    this.showEntities = !this.showEntities;
    this.showContracts = !this.showContracts;
    this.tabGroup.realignInkBar();
  }

  public addEntityOrContract() {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Create New Contract Group',
          handler: () => {
            this.navCtrl.push(NewEntityPage, { entities: this.entities });
          }
        },
        {
          text: 'Add Contract',
          handler: () => {
            this.navCtrl.push(NewContractPage);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public openContractDetail(contract: Contract): void {
    this.navCtrl.push(ContractDetailPage, { contractID: contract.contractID });
  }
}
