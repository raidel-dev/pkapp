import { State } from '../../shared/models/state/state';
import { Utility } from '../../shared/models/utility/utility';

export class ContractFilter {

  constructor() {
    this.statuses = [];
    this.utilities = [];
    this.states = [];
  }

  public statuses: { label: string, status: number}[];
  public utilities: Utility[];
  public states: State[];
  public signatureDateFrom: Date;
  public signatureDateTo: Date;
}