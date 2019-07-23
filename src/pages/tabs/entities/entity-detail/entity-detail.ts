import { Component } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

import { ContractFilter } from '../../../../pipes/contracts-filter/contract-filter';
import { AppStateServiceProvider } from '../../../../providers/app-state/app-state-service';
import { GraphqlServiceProvider } from '../../../../providers/graphql/graphql-service';
import { HelperServiceProvider } from '../../../../providers/helper/helper-service';
import { Constants } from '../../../../shared/constants';
import { Contract } from '../../../../shared/models/contract/contract';
import { Entity } from '../../../../shared/models/entity/entity';
import { State } from '../../../../shared/models/state/state';
import { Utility } from '../../../../shared/models/utility/utility';
import { ContractDetailPage } from '../contract-detail/contract-detail';
import { PreloadedContractPage } from '../preloaded-contract/preloaded-contract';
import { AuctionInProgressPage } from '../../../auction/auction-in-progress/auction-in-progress';
import { NewContractPage } from '../new-contract/new-contract';

@IonicPage()
@Component({
  selector: 'page-entity-detail',
  templateUrl: 'entity-detail.html',
})
export class EntityDetailPage {

  public filter: ContractFilter = new ContractFilter();
  public contracts: Contract[];
  public states: State[];
  public statuses = [
    { label: "Quote", status: Constants.quoteStatuses.quote },
    { label: "Pending", status: 96 }, // what is pending?  original logic is for residential only
    { label: "Signed", status: Constants.quoteStatuses.signed },
    { label: "Ready for Auction", status: Constants.quoteStatuses.confirmed * -1 },
    { label: "Confirmed", status: Constants.quoteStatuses.confirmed },
    { label: "Auction Complete", status: Constants.quoteStatuses.acomp },
    { label: "Auction In Progress", status: Constants.quoteStatuses.ainp },
    { label: "Rejected", status: Constants.quoteStatuses.rejected },
    { label: "Dropped", status: Constants.quoteStatuses.dropped }
  ];
  public Constants = Constants;

  public entity: Entity;
  public currentMenuId: string;
  public menus: any = [
    {
      menuid: "status",
      menutitle: "Status",
      subtitle: "Any",
      items: this.statuses
    },
    {
      menuid: "utility",
      menutitle: "Utility",
      subtitle: "Any"
    },
    {
      menuid: "state",
      menutitle: "State",
      subtitle: "Any"
    },
    {
      menuid: "signaturedate",
      menutitle: "Signature Date",
      subtitle: "Any",
      items: [{ from: "", to: "" }]
    }
  ]

  public enableShowGas: boolean = false;
  public enableShowElectricity: boolean = false;

  public type: 'string';
  public format: 'YYYY-MM-DD'
  public optionsRange: CalendarComponentOptions = {
    from: new Date(1),
    pickMode: 'range',
    color: 'primary',
    weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthFormat: "MMMM YYYY"
  };

  public loading = true;

  constructor(private appStateService: AppStateServiceProvider,
    private graphQLService: GraphqlServiceProvider,
    private menuCtl: MenuController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.entity = navParams.data.entity;
    this.currentMenuId = 'status';
  }

  ionViewWillLeave() {
    this.appStateService.setTabHidden(false);
  }

  ionViewDidEnter() {
    this.graphQLService.getEntityDetailData(this.entity.id)
      .then(result => {
        this.contracts = result.data.entity.contracts
          .map(c => new Contract(c))
          .filter(c => !c.renewalID);
        this.states = result.data.states.data.map(s => new State(s));
        this.loading = result.loading;
      });
  }

  public getAllStates(): State[] {
    return this.states
      ? this.states
      : [];
  }

  public getAllUtilities(): Utility[] {
    return this.contracts
      ? _.uniqBy(_.flatMap(this.contracts.map(c => c.locations ? c.locations.map(l => l.utility) : [])), 'utilityID')
      : [];
  }

  public selectUtilityFilter(utility: Utility): void {
    if (!this.filter.utilities.find(u => u.utilityID === utility.utilityID)) {
      this.filter.utilities.push(utility);
    } else {
      const index = this.filter.utilities.findIndex(u => u.utilityID === utility.utilityID);
      this.filter.utilities.splice(index, 1);
    }
    this.filter = _.cloneDeep(this.filter); // rebuild for pure filter
    this.menus.find(m => m.menuid === this.currentMenuId).subtitle = this.getSubTitle(this.filter.utilities.map(u => u.name));
  }

  public selectStatusFilter(status: { label: string, status: number }): void {
    if (!this.filter.statuses.find(s => s.status === status.status)) {
      this.filter.statuses.push(status);
    } else {
      const index = this.filter.statuses.findIndex(s => s.status === status.status);
      this.filter.statuses.splice(index, 1);
    }
    this.filter = _.cloneDeep(this.filter); // rebuild for pure filter
    this.menus.find(m => m.menuid === this.currentMenuId).subtitle = this.getSubTitle(this.filter.statuses.map(s => s.label));
  }

  public selectStateFilter(state: State): void {
    if (!this.filter.states.find(s => s.stateID === state.stateID)) {
      this.filter.states.push(state);
    } else {
      const index = this.filter.states.findIndex(s => s.stateID === state.stateID);
      this.filter.states.splice(index, 1);
    }
    this.filter = _.cloneDeep(this.filter); // rebuild for pure filter
    this.menus.find(m => m.menuid === this.currentMenuId).subtitle = this.getSubTitle(this.filter.states.map(s => s.stateLong));
  }

  private getSubTitle(names: string[]): string {
    if (names.length === 0) return 'Any';
    if (names.length === 1) return names[0];

    return `${names[0]} + ${names.length - 1} more`;
  }

  public isStatusSelected(status: { label: string, status: number }): boolean {
    return !!this.filter.statuses.find(s => s.status === status.status);
  }

  public isUtilitySelected(utility: Utility): boolean {
    return !!this.filter.utilities.find(s => s.utilityID === utility.utilityID);
  }

  public isStateSelected(state: State): boolean {
    return !!this.filter.states.find(s => s.stateID === state.stateID);
  }

  public showGasContracts(): void {
    this.enableShowGas = true;
  }

  public showElectricityContracts(): void {
    this.enableShowElectricity = true;
  }

  // menu controllers
  public initMenus() {
    for (let menu of this.menus) {
      this.menuCtl.enable(false, menu.menuid);
    }
  }



  public closeMenu() {
    this.menuCtl.close();
  }

  public closeSelectedMenu() {
    this.initMenus();
    this.menuCtl.enable(true, "filter");
    this.menuCtl.toggle("filter");
  }

  public openMenu(menuId: string) {

    this.initMenus();
    this.menuCtl.enable(true, menuId);
    this.menuCtl.toggle(menuId);
    this.currentMenuId = menuId;
  }

  public onChangeCalendar(event: any) {
    const menuItem = this.menus.find(m => m.menuid === 'signaturedate');
    menuItem.selecteddetailitem = 0;
    const dateObj = menuItem.items[0];
    menuItem.subtitle = this.timeConverter(dateObj.from) + " - " + this.timeConverter(dateObj.to);
    this.filter.signatureDateFrom = new Date(dateObj.from);
    this.filter.signatureDateTo = new Date(dateObj.to);
    this.filter = _.cloneDeep(this.filter); // rebuild for pure filter
  }

  public clearDate(): void {
    const menuItem = this.menus.find(m => m.menuid === 'signaturedate');
    menuItem.selecteddetailitem = -1;
    menuItem.subtitle = 'Any';
    this.filter.signatureDateFrom = null;
    this.filter.signatureDateTo = null;
    this.filter = _.cloneDeep(this.filter); // rebuild for pure filter
  }

  private timeConverter(timeStamp: number): string {
    return HelperServiceProvider.unixTimeStampToString(timeStamp);
  }

  public openContactDetail(contract: Contract) {
    this.navCtrl.push(ContractDetailPage, { contractID: contract.contractID });
  }

  public goAddPreloadedConract(): void {
    this.navCtrl.push(PreloadedContractPage, { entity: this.entity });
  }

  public goAddContract(): void {
    this.navCtrl.push(NewContractPage);
  }

  public goAuction(contract: Contract): void {
    this.navCtrl.push(AuctionInProgressPage, { contractID: contract.contractID });
  }
}
