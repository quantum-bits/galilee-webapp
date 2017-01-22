//TODO: should make this implement the IResource interface,
//      but currently there are some disagreements in the properties
//      of the interface and the model

export class Resource {
  public caption: string = '';
  public copyrightYear: number; // the data has a string here
  public copyrightOwner: string = '';
  public fileName: string = 'FOO';

  private resourceId: string;
  private collectionId: string;
  private typeId: number;

  constructor(private fileItem: any) {
    const now = new Date();
    this.copyrightYear = now.getFullYear();
  }

  // fileName(): string {
  //   return this.fileItem.file.name;
  // }

  uploaded(): boolean {
    return this.resourceId !== undefined;
  }
}
