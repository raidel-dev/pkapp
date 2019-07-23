export class Document {
  constructor(document: Document) {
    Object.assign(this, document);

    this.attachmentBase64 = 'data:application/pdf;base64,' + document.attachmentBase64;
  }

  public name: string;
  public description: string;
  public attachmentID: string;

  public attachmentBase64: string;
}