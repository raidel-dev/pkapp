import { Rate } from "../../shared/models/rate/rate";

export class HelperServiceProvider {
  public static serialize(obj: any): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];

            params.set(key, element);
        }
    }
    return params;
  }

  public static unmaskAnnualUsage(annualUsage: any): number {
    const asNumber = Number(annualUsage);

    if (isNaN(asNumber)) {
      return Number(annualUsage.replace(/,/g, ''));
    }

    return asNumber;
  }

  public static formatPhone(phoneNumber: string): string {
    if (!phoneNumber) return "";

    var splitPhone = String(phoneNumber)
      .replace(/-|\.|\(|\)/g, "")
      .replace(/ /g, "")
      .split("");

    return "(" + splitPhone[0] + splitPhone[1] + splitPhone[2] + ") "
                + splitPhone[3] + splitPhone[4] + splitPhone[5] + "-"
                + splitPhone[6] + splitPhone[7] + splitPhone[8] + splitPhone[9];
  }

  public static sanitizeErrorMessage(message: string): string {
    return message
      .replace('Unexpected error value: ', '')
      .replace('"', '');
  }

  public static getDecimalPart(total: number): string {
    if (total) {
      const totalParts = String(total.toFixed(2)).split('.');
      if (totalParts.length > 1) {
        if (Number(totalParts[1]) < 10 && totalParts[1] !== '00') {
          return '0' + totalParts[1];
        }
        return totalParts[1];
      }
    }

    return '00';
  }

  public static getMainPart(total: number): string {
    if (total) {
      return String(total).split('.')[0];
    }

    return '0';
  }

  public static daysFromToday(date: Date): number {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var today = new Date();

    return Math.round(Math.abs((today.getTime() - date.getTime()) / oneDay));
  }

  public static unixTimeStampToString(timeStamp: number): string {
    const a = new Date(timeStamp);
    return a.toLocaleDateString();
  }

  public static toFriendlyRate(rate: any): Rate {
    return {
      addDate: rate.ADDDATE,
      bandwidthPercentage: rate.BANDWIDTHPERCENTAGE,
      baseRate: rate.BASERATE,
      billingMethod: rate.BILLINGMETHOD,
      customerID: rate.CUSTOMERID,
      displayRate: rate.DISPLAYRATE,
      logo: rate.LOGO,
      name: rate.NAME,
      productID: rate.PRODUCTID,
      rfqSessionID: rate.RFQSESSIONID,
      rate: rate.RATE,
      savings: rate.SAVINGS,
      supplierID: rate.SUPPLIERID,
      term: rate.TERM,
      termName: rate.TERMNAME,
      units: rate.UNITS,
      usageAdjustment: rate.USAGEADJUSTMENT,
      termsAndConditions: rate.TERMSANDCONDITIONS,
      tosPath: rate.TOSPATH,
      product: rate.product,
      supplier: rate.supplier,
      customer: rate.customer,
      greenPercentage: rate.GREENPERCENTAGE,
      enRateDetail: rate.ENRATEDETAIL
    } as Rate;
  }

  public static getFriendlyTimeString(endDate: Date): string {
    var timeParts = endDate.toLocaleTimeString().split(':');
    return `${[timeParts[0], '00'].join(':')} ${timeParts[2].split(' ')[1]}`;
  }
}
