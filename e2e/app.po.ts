export class GalileePage {
  navigateTo() {
    return browser.get('/');
  }

  getToolbar() {
    return $('nav').getText();
  }

}
