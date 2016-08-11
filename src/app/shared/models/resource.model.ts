export class Resource {
  public caption: string = '';
  public copyrightYear: number;
  public copyrightOwner: string = '';
  public fileName: string;

  private resourceId: string;
  private collectionId: string;
  private typeId: number;

  constructor(private fileItem: any) {
    const now = new Date();
    this.copyrightYear = now.getFullYear();
  }

  uploaded(): boolean {
    return this.resourceId !== undefined;
  }
}
