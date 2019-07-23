import { RateClass } from "./rate-class";
import { Zone } from "./zone";

export class Utility {
  constructor(utility: Utility) {
    Object.assign(this, utility);
  }

  public utilityID?: string;
  public name?: string;
  public abbreviation?: string;
  public showNameKey?: string;
  public showMeterNum?: string;
  public showReferenceNum?: string;
  public baseRate?: number;
  public sampleBillAttachmentID: string;

  // for contract location assignments
  public id?: string;

  public rateClasses: RateClass[];
  public zones: Zone[];
  public unit: string;
}