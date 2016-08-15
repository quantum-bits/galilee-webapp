export class Resource {
  public caption: string = '';
  public copyrightYear: number;
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
