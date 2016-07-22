export class AdminEditReadingResourcesPage {

  navigateTo() {
    return browser.get('/admin/edit-reading-resources');
  }

  getCollapsibleDivText() {
    return $('.collapsible-header').getText();
  }

  getCollapsibleDiv() {
    return element(by.css('.collapsible-header'));
  }
}
