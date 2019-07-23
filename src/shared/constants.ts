import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export class Constants {
  public static storageKeys = {
    isTosAccepted: 'pk:isTosAccepted',
    authFields: 'pk:authFields',
    questionAnswers: 'pk:questionAnswers',
    savedSignature: 'pk:savedSignature',
    rememberedUsername: 'pk:rememberedUsername',
    showFeedbackPopup: 'pk:showFeedbackPopup'
  };
  public static ticketCategories = {
    dropped: 8
  }
  public static payments = {
    cents: 100
  }
  public static validators = {
    email: new RegExp('^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$', 'i'),
    password: new RegExp('^(?=.{8})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^0-9A-Za-z])(?!.*[pP][aA@][sS][sS][wW][oO0][rR][dD])'),
    phone: '^(\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$'
  };
  public static masks = {
    phone: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    usage: createNumberMask({ prefix: '' })
  };
  public static signaturePrefix = 'data:image/png;base64,';
  public static oneDay = 24 * 60 * 60 * 1000;
  public static serviceTypes = {
    electricity: '297ed5063d424e7b013d429edf0d0006',
    gas: '297ed5063d424e7b013d429f0e850007'
  }
  public static quoteStatuses = {
    RFQ: 97,
    Commercial: 99,
    Residential: 99,
    cr: 94,
    acomp: 95,
    ainp: 96,
    dr: 97,
    quote: 99,
    signed: 0,
    payroll: 1,
    confirmed: 2,
    rejected: 4,
    expired: 5,
    dropped: 6,
    94: 'Contract Ready',
    95: 'Auction Complete',
    96: 'Auction In Progress',
    97: 'Request Price',
    98: 'Opportunity',
    99: 'Quote',
    0: 'Signed',
    1: 'Pay Roll ',
    2: 'Confirmed',
    4: 'Rejected',
    5: 'Expired',
    6: 'Dropped'
  }
}
