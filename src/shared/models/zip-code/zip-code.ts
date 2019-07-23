import { DefaultUtilityMap } from "../utility/default-utility-map";

export class ZipCode {
  constructor(zipCode: ZipCode) {
    Object.assign(this, zipCode);
  }

  public stateID: string;
  public stateShort: string;
  public stateLong: string;
  public city: string[];
  public defaultUtilityZone: string;

  public defaultUtilities: DefaultUtilityMap[];
}