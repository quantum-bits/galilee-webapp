export class ReadingsPage {

  private practicesButton = element(by.linkText('PRACTICES'));
  private resourcesButton = element(by.linkText('RESOURCES'));
  private lectioDivinaMenuItem = element(by.linkText('LECTIO DIVINA'));
  private noahsArkMenuItem = element(by.linkText("NOAH'S ARK (IMAGE)"));

  //constructor() {}

  navigateTo() {
    return browser.get('/end-user/readings');
  }

  getPracticesButton() {
    return this.practicesButton;
  }

  clickPracticesButton() {
    this.practicesButton.click();
  }

  getResourcesButton() {
    return this.resourcesButton;
  }

  clickResourcesButton() {
    return this.resourcesButton.click();
  }

  clickLectioDivinaMenuItem() {
    this.lectioDivinaMenuItem.click();
  }

  clickNoahsArkMenuItem() {
    this.noahsArkMenuItem.click();
  }

}
